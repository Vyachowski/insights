# Design: remove-seed

## Context

Data intake today is split between two subsystems. The app has admin-only CSV import endpoints (`POST <resource>/import` for uploads, `POST <resource>/import-url` for fetching by URL) covering calls, revenue, expenses, and metrics. Reference data (users, cities, sites) can only be populated by the standalone seed (`apps/backend/src/prisma/seed/`, ~1,245 lines), which duplicates CSV parsing and city-name normalization, and also contains a Yandex Metrika fetcher used to *produce* metrics CSVs.

Constraints:

- City names and site domains are private business data — must not be committed to the repo.
- Other CSVs (calls, revenue, expenses, metrics) reference sites by explicit `id`/city name, so bootstrap must preserve the ids from `sites.csv` / `cities.csv`.
- CSV parsing must stay portable (pure functions), since a future migration to React Router 7 framework mode will reuse it in route actions.
- Deployed on Railway; config via env vars / Railway service variables.

## Goals / Non-Goals

**Goals:**

- Delete the seed subsystem entirely; the DB is fully re-creatable via startup bootstrap + CSV uploads.
- Bootstrap reference data (users, cities, sites) on app startup from env config — no data in the repo.
- Keep the existing upload/import behavior unchanged and give it a spec (`data-import`).

**Non-Goals:**

- No new frontend work (existing import UI already covers all four data resources).
- No replacement for the Yandex Metrika fetcher — metrics CSVs are produced outside the app.
- No CRUD endpoints for cities/sites; changing them later means editing the source CSVs and re-bootstrapping (or manual SQL).
- No ORM/framework changes (tracked separately).

## Decisions

### 1. Startup bootstrap module, not a data migration

A `BootstrapModule` with a provider implementing `OnApplicationBootstrap` runs after DB connection:

1. **Users**: if `User` table is empty, create admin + regular user from env vars (`BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`, `BOOTSTRAP_USER_EMAIL`, `BOOTSTRAP_USER_PASSWORD`), hashing with argon2 (same as auth).
2. **Cities**: if `City` table is empty, fetch CSV from `CITIES_CSV_URL`, parse, insert with explicit ids.
3. **Sites**: if `Site` table is empty (and cities exist), fetch from `SITES_CSV_URL`, insert with explicit ids.

Why not a data migration: migrations live in the repo → business data would be committed in plain text. Why not manual import endpoints for cities/sites: bootstrap is one less UI flow and makes a fresh environment usable with zero manual steps.

Alternative considered: fetching at `prisma migrate` time via a script — rejected, migrations should stay deterministic and offline.

### 2. Empty-table check as the idempotency guard

Each of the three steps runs only when its table is empty. Non-empty table → step skipped silently. This makes bootstrap safe to run on every startup and makes re-bootstrap explicit: truncate the table, restart.

### 3. Bootstrap failure does not crash the app

If a CSV URL is unset or the fetch fails, log an error and continue startup. Rationale: the app is still useful (login may work, existing data readable), and Google Drive availability must not gate deploys. The bootstrap logs clearly state what was skipped and why.

### 4. Explicit ids + sequence reset

`cities.csv` and `sites.csv` carry explicit `id` columns referenced by the data CSVs. Bootstrap inserts them as-is and then resets the Postgres identity sequences (`setval`) so subsequent inserts don't collide.

### 5. Reuse and relocate shared pieces, delete the rest

- `fetchUrlToBuffer` + `assertCsvColumns`/`assertSkipRate` (`common/utils/csv.utils.ts`) are reused by bootstrap.
- Row schemas for cities/sites are zod schemas in the bootstrap module — zod's role stays scoped to parsing untrusted file data.
- Everything under `src/prisma/seed/**` is deleted, including the Metrika fetcher. `YANDEX_API_OAUTH_TOKEN` is removed from the env schema (only the seed used it).
- `prisma:seed` script and the prisma `seed` config key are removed from `package.json`.

### 6. Squash migration history

The DB is now fully re-creatable from files, and the user has explicitly OK'd a clean slate. The two existing migrations (`20260328132956_initial`, `20260523192626_add_partial_unique_null_site_indexes`) are deleted and replaced with a single fresh `init` migration generated from the current schema. Every environment (dev and prod) is recreated: drop DB → migrate → bootstrap → upload data CSVs. This removes any doubt about migration-history drift going into the future full-stack migration.

### 7. Env schema changes

Added to `validation.config.ts` (all **optional** — absence means the corresponding bootstrap step is skipped): `CITIES_CSV_URL`, `SITES_CSV_URL`, `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`, `BOOTSTRAP_USER_EMAIL`, `BOOTSTRAP_USER_PASSWORD`. Removed: `YANDEX_API_OAUTH_TOKEN`. `.env.example` documents the Google Drive direct-download URL format (`https://drive.google.com/uc?export=download&id=<FILE_ID>`, file shared as "anyone with the link").

## Risks / Trade-offs

- [Drive link dead/private at first prod boot] → bootstrap skips with a loud error log; fix the link, restart. App never crash-loops over it.
- [CSV format drift between Desktop copies and parser expectations] → zod row schemas + `assertCsvColumns` fail fast with a precise error naming the missing column.
- [Anyone-with-link exposure of city/site lists] → accepted: low-sensitivity data, unguessable URL; noted so it's a conscious choice.
- [Explicit ids desync sequences] → sequence reset built into bootstrap (Decision 4).
- [Bootstrap credentials linger in env] → acceptable for a solo project; they're only *used* when the User table is empty.

## Migration Plan

1. Land bootstrap module + env schema changes + seed deletion + squashed `init` migration in one commit series on `main`.
2. Upload `cities.csv`/`sites.csv` (from the Desktop `data/` copy) to Google Drive, set share = anyone-with-link, put direct-download URLs into `.env.dev` and Railway service variables along with bootstrap credentials.
3. Local verify (full clean-slate rehearsal): drop dev DB → `prisma migrate deploy` → start app → confirm users/cities/sites bootstrapped → upload all data CSVs via UI → spot-check dashboard numbers.
4. Prod: same clean-slate procedure — recreate the database, deploy, let bootstrap populate reference data, upload data CSVs via UI.

Rollback: revert the commits (seed and old migrations restorable from git history); data is re-importable from the Desktop CSV copies at any point.

## Open Questions

- None blocking. CSV header contract for cities/sites is pinned by the existing Desktop files; verify during implementation that the parser matches them exactly.

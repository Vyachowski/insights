# Proposal: remove-seed

## Why

The backend carries a ~1,245-line seed subsystem (`apps/backend/src/prisma/seed/`) that duplicates logic already present in the app (city-name normalization, CSV parsing) and mixes three concerns: DB bootstrap, CSV import, and a Yandex Metrika fetcher. Meanwhile the app already imports calls, revenue, expenses, and metrics via `POST <resource>/import` CSV uploads. Making file upload the single data-intake path lets us delete the seed entirely and makes the database fully re-creatable from files — a prerequisite for the planned migration to a full-stack architecture (React Router 7 framework mode), where a fresh app + fresh DB is populated via the import UI.

## What Changes

- Bootstrap the `City` and `Site` reference tables on startup: if empty, fetch CSVs from env-configured URLs (`CITIES_CSV_URL`, `SITES_CSV_URL`, e.g. Google Drive direct-download links), reusing the existing `import-url` fetch/parse pattern. No business data (city names, site domains) is committed to the repo.
- Add initial user bootstrap that replaces `seedUsers`: create admin/user accounts from env vars on startup if the `User` table is empty (no password hashes committed to the repo).
- **BREAKING** (dev workflow only): delete `apps/backend/src/prisma/seed/` and the `prisma:seed` npm script. Database population is now: start app → log in as bootstrapped admin → upload CSVs.
- Delete `seed/data/seed_data.zip` from the repo; the CSV files live outside the repo (user keeps a copy of the `data/` folder on Desktop) and enter the app only via upload.
- The Yandex Metrika fetcher inside the seed (`creators/site-metrics/`) is deleted with it; metrics CSVs are produced outside the app and uploaded like everything else.
- **BREAKING**: squash the Prisma migration history into a single fresh `init` migration; all environments (dev and prod) are recreated from a clean slate (drop DB → migrate → bootstrap → upload CSVs).

## Capabilities

### New Capabilities

- `data-import`: covers all data intake — existing CSV resource imports (calls, revenue, expenses, metrics), the env-URL bootstrap of cities/sites, and the admin-user bootstrap. Today this behavior exists in code but has no spec.

### Modified Capabilities

None — existing specs (`development-workflow`, `backend-architecture`) do not mention the seed subsystem, so no requirement-level changes.

## Impact

- Backend: startup bootstrap provider (users from env vars, cities/sites from env-URL CSVs); delete `src/prisma/seed/**` (~1,245 lines); remove `prisma:seed` script and seed config from `package.json`.
- Env: new vars `CITIES_CSV_URL`, `SITES_CSV_URL`, admin/user credentials — documented in `.env.example`, set as Fly secrets in prod.
- Frontend: no changes (existing import UI already covers calls/revenue/expenses/metrics).
- Deps: none added; `csv-parse` already in use.
- Data: `seed_data.zip` deleted (backed up outside the repo); no schema changes, but migration history reset (existing DBs recreated).
- Follow-up: full-stack migration (RR7 framework mode) depends on this change being done; import logic (CSV parsing as pure functions) should stay portable to route actions.

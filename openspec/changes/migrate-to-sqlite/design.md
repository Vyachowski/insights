# Design: migrate-to-sqlite

## Context

Drizzle on PostgreSQL (node-postgres pool), all DB touchpoints concentrated in `app/server/` (schema, db, migrate, bootstrap, queries/dashboard, imports) plus `db-ping` used by `/health`. Server entry order: env → `migrate()` with connect-retry → bootstrap → listen. Prod on Railway (Nixpacks, `npm run build` / `npm start`); dev Postgres via Docker Compose. Data fully re-creatable: bootstrap (users/cities/sites from env CSV URLs) + CSV imports. Golden verification snapshot exists: the dashboard JSON produced from the canonical CSV set.

Constraints surfaced by review (agy):

- SQLite `ON CONFLICT` targets must exactly match a full unique index; Drizzle cannot express a conflict target over a partial index. Our importers already comply (manual select→insert/update for revenue/expenses; metrics targets the full `(site_id, date)` unique; calls uses target-less `onConflictDoNothing`) — this becomes a standing rule, not a change.
- SQLite date functions (`datetime()`, `strftime()`) expect epoch *seconds*; our epoch-*ms* integers must never be passed to them. Current queries only do range comparisons on raw columns, which are integer comparisons — also a standing rule.
- WAL mode is mandatory: default journal mode would let a 29k-row calls import block dashboard reads (`SQLITE_BUSY`).
- `better-sqlite3` throws if the DB file's parent directory doesn't exist; drizzle-kit's SQLite partial-index SQL generation is unreliable and must be eyeballed.

## Goals / Non-Goals

**Goals:**

- Zero database services: a file on a Railway Volume in prod, a file in `./data/` locally; Docker gone from dev.
- Money stored as integer kopecks end-to-end; the string-numeric `Number()` conversions die.
- Dashboard output matches the golden snapshot (amounts scaled ×100 at the storage layer, identical after formatting).

**Non-Goals:**

- No backups/replication (follow-up `add-bucket-storage`); recovery = bootstrap + re-upload.
- No query optimization or behavior changes; parity port only.
- No UI changes beyond money formatting internals.

## Decisions

### 1. Driver and connection

`better-sqlite3`, single shared connection in `app/server/db.ts` (sync driver; one connection is the correct concurrency model). Opened with:

```
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;
```

`PRAGMA foreign_keys = ON` is applied **after** `migrate()` completes, not at open: drizzle-kit alters SQLite tables via create-temp/copy/drop, which violates active FK constraints mid-migration. Runtime queries then run with FKs on (schema relies on cascades).

`fs.mkdirSync(dirname(DATABASE_PATH), { recursive: true })` before opening; a committed `data/.gitkeep` keeps the local folder present for drizzle-kit CLI runs. `db-ping.ts` dies; `/health` runs `SELECT 1` through the same connection.

Sync-driver caveat: better-sqlite3 executes on the event-loop thread, so a large import would starve HTTP requests for its duration. The calls importer already inserts in 1000-row chunks; chunks are separated by an explicit `setImmediate` yield so the loop drains I/O between them. Total import time at our sizes is ~1–2s — acceptable for a solo-admin operation.

### 2. Type mappings (schema.ts → sqlite-core)

| Postgres | SQLite | Notes |
|---|---|---|
| `serial` PK | `integer` PK `autoincrement` | keeps monotonic ids; `sqlite_sequence` is the counter |
| `numeric(12,2)` amount | `integer` (kopecks) | importers `Math.round(parseFloat(x) * 100)`; UI formatters `/100` |
| `date` (mode string) | `text` `'YYYY-MM-DD'` | app already handles this format |
| `timestamp(3)` | `integer` (`mode: 'timestamp_ms'`) | JS Dates round-trip; **never fed to SQLite date functions** |
| `pgEnum` Role/UserStatus | `text` | app-side unions unchanged; no CHECK constraint (drizzle-kit SQLite CHECK support is flaky, enforcement stays in zod/TS) |
| `uuid` text PK (users) | `text` PK | unchanged, `$defaultFn(randomUUID)` |
| `defaultNow()` / `$onUpdate` | `$defaultFn(() => new Date())` / `$onUpdate` | **not** `defaultNow()`: its SQLite SQL default is `unixepoch()` (seconds), which would corrupt `timestamp_ms` columns ×1000; client-side defaults sidestep it |

Partial unique indexes carry over via `uniqueIndex().where(sql\`site_id IS NULL\`)`; the generated migration SQL is **manually verified** to contain the `WHERE` clauses (drizzle-kit SQLite flakiness), hand-edited if needed. Standing rule: no `onConflict` may target a partial index.

### 3. Date filtering in queries

`betweenDates` (DATE-as-text columns) becomes lexicographic string comparison — `'YYYY-MM-DD'` sorts correctly, params are the same truncated UTC date strings. `betweenInstants` (timestamp columns) becomes integer comparison against `Date.getTime()`. The `CAST(... AS timestamptz)` constructs die. Week/month periods keep being computed in JS (`date.service.ts` untouched).

### 4. Money as kopecks

- Importers: parse CSV decimal → `Math.round(parseFloat * 100)`; the equality check for skip/update compares integers.
- Dashboard queries: `sum()` returns an integer (or string per driver) → normalize once at the query layer, divide by 100 **at the query boundary** so loader JSON keeps rubles — this keeps the golden snapshot byte-comparable and UI formatters untouched.
- Data-page loader: same `/100` at the boundary; `RevenueDto.amount` stays "rubles as number" for the views.

Rationale: converting at the query boundary (not in components) keeps the kopecks decision invisible above `app/server/`, and the golden-snapshot diff stays valid.

### 5. Migration/startup

`drizzle-kit generate` with `dialect: 'sqlite'` produces a fresh init migration (old `drizzle/` set is deleted — clean slate, both envs recreated). `migrate()` from `drizzle-orm/better-sqlite3/migrator` runs in the server entry; the connect-retry loop and `DATABASE_CONNECT_*` vars die (a local file needs no retries). Startup order unchanged: env → mkdir+open+pragmas → migrate → bootstrap → listen.

### 6. Bootstrap sequence reset — deleted

SQLite `AUTOINCREMENT` maintains `sqlite_sequence` at max(rowid) automatically, including for explicit-id inserts, so the Postgres `setval` step has no SQLite equivalent to port — `resetIdSequence` is removed from bootstrap entirely. Everything else in bootstrap is dialect-neutral.

### 7. Railway

Volume mounted at `/data`; `DATABASE_PATH=/data/insights.db` service variable; `DATABASE_URL`/`DATABASE_CONNECT_*` removed. Deploy strategy: single replica + Recreate (volume attaches to one container) — seconds of downtime per deploy, accepted. Postgres service deleted only after prod cutover is verified. `better-sqlite3` ships prebuilt binaries for linux-x64/glibc (Nixpacks default image); if the build ever falls back to source compilation, add build tools to nixpacks config — noted as risk, not pre-provisioned.

## Risks / Trade-offs

- [drizzle-kit emits wrong/missing partial-index SQL] → migration SQL is reviewed by hand before first run; it's a plain SQL file, hand-editable.
- [Kopecks conversion misses a spot → numbers ×100 or /100 on screen] → golden-snapshot diff catches the query layer; data-page visual check catches the views; grep for `Number(` conversions on amounts as a sweep.
- [WAL leaves `-wal`/`-shm` sidecar files] → they live next to the DB file on the same volume; harmless, but any future "backup = copy file" must copy all three or checkpoint first (relevant to `add-bucket-storage`).
- [better-sqlite3 native module vs Node version on Railway] → pin Node via `engines`/mise so prebuilt binaries match; source-build fallback documented above.
- [Railway Volume may mount root-owned while the container runs as another user] → if startup hits `EACCES` on `/data`, run the container as root or chown in a prestart step; verified during prod cutover.
- [No DB server = no remote psql access to prod data] → accepted; debugging path is Railway shell (`sqlite3` CLI) or downloading the file; data is disposable anyway.

## Migration Plan

1. Implement locally: schema/db/migrate/bootstrap/queries/imports + fresh init migration; delete Docker/dev-scripts; clean-slate rehearsal (rm file → dev → bootstrap → import CSVs → golden-snapshot diff).
2. Railway: add Volume (`/data`), set `DATABASE_PATH`, remove dead env vars, set Recreate/single-replica; push → deploy; verify migrate+bootstrap logs; user uploads CSVs via prod UI; verify dashboard.
3. Delete the Railway Postgres service after verification.

Rollback: git revert + re-add `DATABASE_URL` (Postgres service kept until step 3); data re-creatable on either engine.

## Open Questions

- None blocking. `sum()` return type under better-sqlite3 (number vs bigint for large sums) is checked during implementation; amounts fit in JS safe integers by orders of magnitude.

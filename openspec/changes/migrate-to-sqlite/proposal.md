# Proposal: migrate-to-sqlite

## Why

The app's workload is a textbook SQLite case: single Railway instance, single writer, two users, ~55k rows, read-heavy dashboard aggregations. Running a separate PostgreSQL server buys nothing here and costs a managed Railway Postgres service, Docker Compose + `dev:up` scripts for local dev, connect-retry logic in the server entry, and a network hop on every query. SQLite collapses the database into a file inside the app: zero services, zero containers locally, `npm install && npm run dev` as the entire dev setup. Data is fully re-creatable (bootstrap + CSV uploads — the flow built and rehearsed by the previous two changes), so the migration path is drop-and-rebuild, not data transfer.

## What Changes

- **Drizzle dialect swap**: `app/server/schema.ts` moves from `pg-core` to `sqlite-core`; fresh init migration via drizzle-kit (`dialect: 'sqlite'`). Partial unique indexes and `onConflictDoNothing/DoUpdate` carry over — SQLite supports both.
- **Type mappings** (SQLite has no numeric/date/enum):
  - **BREAKING**: money (`amount`) becomes **integer kopecks** — CSV importers convert `Math.round(parseFloat(x) * 100)` on the way in, UI formatters divide by 100 on the way out. Kills the `Number(string-numeric)` conversions Postgres forced everywhere.
  - DATE columns → `text` `'YYYY-MM-DD'` (already the app-side format); timestamps → `integer` epoch ms (drizzle `mode: 'timestamp_ms'`); enums (`Role`, `UserStatus`) → `text`.
- **Driver**: `better-sqlite3` (synchronous, boring, fastest for this size), opened with `PRAGMA journal_mode=WAL` + `busy_timeout` so dashboard reads never hit `SQLITE_BUSY` during large CSV imports. `pg`, `@types/pg`, `db-ping` pool die; health check becomes a trivial pragma query.
- **Storage**: local — `./data/insights.db` (gitignored); prod — Railway **Volume** mounted at `/data`, `DATABASE_PATH` env var replaces `DATABASE_URL`. Single replica + **Recreate deploy strategy** (a volume attaches to one container; overlapping deploys are impossible) — accepting a few seconds of downtime per deploy.
- **No backup machinery in this change** — data is disposable (bootstrap + re-upload is the recovery path). Backups to Railway Bucket land in the follow-up `add-bucket-storage` change.
- **Deletions**: Docker Compose (`docker-compose.dev.yml`, `dev:up/down/reset/logs` scripts), `DATABASE_CONNECT_RETRIES`/`DELAY` env vars and the migrate retry loop (a local file needs no retries), Railway Postgres service (decommissioned after cutover).
- Dashboard query date helpers (`betweenDates`/`betweenInstants` with `timestamptz` casts) rewritten as plain text/integer comparisons. Verification against the golden snapshot: same CSVs → dashboard JSON must match the saved pre-migration output (modulo kopeks scaling).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app`: repository layout gains `data/` (local DB file); deployment requirement changes (volume, single replica, `DATABASE_PATH`); portfolio schema unchanged.
- `fullstack-architecture`: server-only modules requirement — Drizzle schema/migrator wording moves from PostgreSQL to SQLite; startup order keeps env → migrate → bootstrap → listen (без retry).
- `data-import`: bootstrap requirement — "Postgres identity sequences" reset becomes SQLite autoincrement (`sqlite_sequence`) reset; import amounts stored as integer kopecks (behavioral counts unchanged).

## Impact

- Code: `schema.ts`, `db.ts`/`db-ping.ts`, `migrate.ts`, `bootstrap.ts`, `queries/dashboard.ts`, `imports/index.ts`, `env.ts`, `server.ts`, `drizzle.config.ts`, money formatters in data-tab views; fresh `drizzle/` migration set.
- Deps: −`pg`, −`@types/pg`; +`better-sqlite3`, +`@types/better-sqlite3`.
- Env: −`DATABASE_URL`, −`DATABASE_CONNECT_RETRIES`, −`DATABASE_CONNECT_DELAY`; +`DATABASE_PATH`.
- Infra: Railway Volume added to the service; Railway Postgres service deleted after verified cutover; local Docker gone.
- Verification: golden-snapshot dashboard diff (amounts scaled), full clean-slate rehearsal locally and on prod.
- Follow-up: `add-bucket-storage` (CSV sources + DB backups in Railway Bucket) builds on this.

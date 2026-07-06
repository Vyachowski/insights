# Tasks: migrate-to-sqlite

## 1. Data layer swap

- [x] 1.1 Rewrite `app/server/schema.ts` on `sqlite-core`: integer autoincrement PKs, amounts as integer kopecks, DATE→text, timestamps→integer `timestamp_ms` with `$defaultFn(() => new Date())` (no `defaultNow()`), enums→text, partial unique indexes via `uniqueIndex().where()`
- [x] 1.2 `app/server/db.ts`: better-sqlite3 connection from `DATABASE_PATH` (mkdir parent recursively), `PRAGMA journal_mode=WAL` + `busy_timeout=5000` at open; FKs enabled after migrate; delete `db-ping.ts`, `/health` does `SELECT 1` via the shared connection
- [x] 1.3 `env.ts`: `DATABASE_PATH` replaces `DATABASE_URL`; drop `DATABASE_CONNECT_RETRIES`/`DELAY`; update `.env` + `.env.example`; gitignore `data/*` + `!data/.gitkeep`, commit `.gitkeep`
- [x] 1.4 `migrate.ts`: better-sqlite3 migrator, no retry loop; `drizzle.config.ts` → `dialect: 'sqlite'`; delete old `drizzle/` set, generate fresh init; **manually verify the SQL contains both partial-index WHERE clauses**
- [x] 1.5 `bootstrap.ts`: remove `resetIdSequence` entirely; deps: −`pg`/`@types/pg`, +`better-sqlite3`/`@types/better-sqlite3`; pin Node via `engines`
- [x] 1.6 Update bootstrap unit tests for the new db shape; `npm test` green

## 2. Queries and imports

- [x] 2.1 `queries/dashboard.ts`: `betweenDates` → lexicographic text comparison, `betweenInstants` → integer epoch-ms comparison (kill `timestamptz` casts); `sum()` results ÷100 to rubles at the query boundary
- [x] 2.2 `imports/index.ts`: amounts `Math.round(parseFloat(x)*100)`; integer equality for skip/update; calls importer chunks separated by explicit `setImmediate` yield; standing rule check — no `onConflict` targets a partial index
- [x] 2.3 `routes/data.tsx` loader: amounts ÷100 at the boundary (views keep receiving rubles); sweep for leftover `Number(amount)` string-numeric conversions

## 3. Local clean-slate verification

- [x] 3.1 Delete `docker-compose.dev.yml` + `dev:up/down/reset/logs` scripts; stop/remove the local Postgres container
- [x] 3.2 Fresh run: no `data/insights.db` → `npm run dev` → migrate + bootstrap (2/40/40) → import all 4 CSVs → **golden-snapshot dashboard diff** (byte-identical JSON)
- [x] 3.3 Concurrency check: start calls import, hit `/dashboard` during it — no `SQLITE_BUSY`, response completes; restart app → bootstrap skips; insert-after-bootstrap gets a non-colliding id
- [x] 3.4 `lint`, `typecheck`, `knip`, `build` green; update CLAUDE.md (commands, layout, SQLite notes)

## 4. Railway cutover

- [ ] 4.1 User in dashboard: add Volume mounted at `/data`; set `DATABASE_PATH=/data/insights.db`; remove `DATABASE_URL`/`DATABASE_CONNECT_*` vars; set single replica + Recreate deploy strategy
- [ ] 4.2 Push → deploy; verify migrate + bootstrap logs and `/health`; watch for volume `EACCES` (fallback: run as root/chown prestart)
- [ ] 4.3 User uploads 4 CSVs via prod UI; dashboard spot-check
- [ ] 4.4 Delete the Railway Postgres service (user, after verification)

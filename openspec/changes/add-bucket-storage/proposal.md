# Proposal: add-bucket-storage

## Why

Two loose ends live outside the Railway project: the cities/sites bootstrap CSVs sit on Google Drive behind "anyone with the link" URLs (security by obscurity, external dependency at every fresh-DB startup), and the SQLite database has no backup at all — recovery relies entirely on re-importing CSVs from the user's Desktop. Railway Buckets (private S3-compatible storage, ~$0.015/GB-month, free operations/egress, per-environment credentials) let both problems collapse into one place: the bucket holds the reference CSVs and receives scheduled database backups, all inside the project.

## What Changes

- **Railway Bucket** added to the project; its S3 credentials (injected as service variables) reach the app via the env schema.
- **Bootstrap CSV source moves to the bucket**: cities/sites CSVs are fetched via the S3 API (private, authenticated) instead of public Drive links. The existing `CITIES_CSV_URL`/`SITES_CSV_URL` plain-URL path stays as a fallback when bucket config is absent (local dev without credentials keeps working).
- **Daily database backup**: a scheduler in the server entry (the long-running Node process) snapshots the SQLite file via better-sqlite3's online `.backup()` API (consistent under WAL), uploads `backups/insights-YYYY-MM-DD.db` to the bucket, and prunes by deterministic name — one DELETE of the object dated `today − retention` (default 14 days), no bucket listing/XML parsing needed. On startup the scheduler checks the age of the latest backup and runs immediately if a cycle was missed (restart/downtime at the scheduled minute). Temp snapshot files on the volume are cleaned before each cycle and in `finally`. Backup failures log and retry next cycle — never crash or block the app.
- **Minimal S3 client**: `aws4fetch` (tiny request signer over `fetch`) instead of the multi-megabyte `@aws-sdk/client-s3` — we need get/put/list/delete only. Confirmed in design.
- The plain-URL fallback *mechanism* stays permanently (any `https://` CSV source works); whether the Google Drive files themselves are deleted afterwards is the user's call.
- Manual restore procedure documented (design): stop the app, remove `-wal`/`-shm` sidecars, replace the DB file with a backup, start. No restore automation in scope.

## Capabilities

### New Capabilities

- `data-backup`: scheduled SQLite backups to the project bucket — snapshot consistency, naming, retention, failure behavior (log, never crash the app).

### Modified Capabilities

- `data-import`: bootstrap reference-CSV source becomes the bucket (S3 GET) with plain-URL fallback; behavioral guarantees (empty-table guards, fault tolerance) unchanged.

## Impact

- Code: `app/server/storage.ts` (new: S3 client wrapper — get/put/list/delete), `bootstrap.ts` (source resolution), `server.ts`/`startup.ts` (cron registration), `env.ts` (bucket credential vars, optional), backup module + retention.
- Deps: +`aws4fetch`, +`node-cron` (or a plain `setInterval` — decided in design).
- Env: + bucket credentials/endpoint/name (names match what Railway injects); existing `*_CSV_URL` vars become fallback-only.
- Infra: one Railway Bucket; user uploads `cities.csv`/`sites.csv` to it once.
- Risk: backup job must never block or crash the server; upload failures are logged and retried next cycle.
- No schema changes, no UI changes, no data reset — this change is purely additive.

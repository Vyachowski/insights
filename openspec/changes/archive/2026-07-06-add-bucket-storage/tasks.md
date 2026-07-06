# Tasks: add-bucket-storage

## 1. Storage wrapper

- [x] 1.1 `env.ts`: optional `BUCKET_ENDPOINT`, `BUCKET_NAME`, `BUCKET_ACCESS_KEY_ID`, `BUCKET_SECRET_ACCESS_KEY` (+ optional `BUCKET_REGION`, default `auto`); `isStorageConfigured` helper; update `.env.example`
- [x] 1.2 `app/server/storage.ts`: aws4fetch `AwsClient` with explicit `{ service: 's3', region }`, **lazily instantiated behind `isStorageConfigured`** (no import-time crash on missing vars); path-style URLs `${endpoint}/${bucket}/${key}`; `getObject` → Buffer, `null` on 404, throw otherwise; `headObject` false strictly on 404, throw otherwise; `putObject` (UNSIGNED-PAYLOAD) and `deleteObject` **throw on non-2xx** (except delete-404 no-op); +`aws4fetch` dep

## 2. Bootstrap source resolution

- [x] 2.1 `bootstrap.ts`: cities/sites fetch tries bucket key (`seed/cities.csv`/`seed/sites.csv`) when storage configured, falls back to `*_CSV_URL` on failure/absence, skips with log when all sources exhausted — inside the existing `runStep` boundary

## 3. Backup scheduler

- [x] 3.1 `app/server/backup.ts`: hourly `setInterval` + startup check; `headObject(today UTC key)` gate; `isBackingUp` overlap guard; snapshot via `sqlite.backup()` to temp on the volume (pre-clean; `finally` unlink via `fs.rmSync(..., { force: true })` so a failed snapshot doesn't mask the original error); `putObject backups/insights-YYYY-MM-DD.db`; prune D−14..D−16 **only after the upload succeeded**; every cycle try/catch-logged; single "backups disabled" log when unconfigured
- [x] 3.2 Register in `server.ts` after `listen`; local run without bucket vars → disabled log, no ticks

## 4. Verification and cutover

- [x] 4.1 Local with dev-bucket creds (user creates the Bucket in Railway, uploads `seed/cities.csv` + `seed/sites.csv`, shares credentials into `.env`): delete local DB → dev run → bootstrap pulls CSVs from the bucket; then force a backup tick → object appears in the bucket, second tick no-ops
- [x] 4.2 Prod: user wires bucket credential variables to the app service; deploy; verify logs (bootstrap skips on populated DB, first backup uploaded); check the object in the bucket UI
- [x] 4.3 Restore drill (local): take a backup file, stop dev server, remove db+sidecars, place backup as `insights.db`, start — app serves the restored data
- [x] 4.4 Update CLAUDE.md: bucket storage, backup schedule, manual restore procedure (stop → remove db+sidecars → place backup → start)
- [x] 4.5 Optional (user): retire the Google Drive links — deferred to the user, URL fallback mechanism stays either way

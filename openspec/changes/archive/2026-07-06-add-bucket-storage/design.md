# Design: add-bucket-storage

## Context

SQLite file at `DATABASE_PATH` (Railway Volume `/data` in prod), WAL mode, single replica. Server entry: env → open db → migrate → FKs → bootstrap → listen. Bootstrap fetches cities/sites CSVs via plain `fetch` from `CITIES_CSV_URL`/`SITES_CSV_URL` (Google Drive today), through the fault-tolerant `runStep` wrapper. Railway Buckets: private S3-compatible storage, per-environment credentials surfaced in the bucket's Credentials tab and referenceable as service variables.

## Goals / Non-Goals

**Goals:**

- Reference CSVs served from the private bucket; Drive dependence optional.
- A daily DB backup lands in the bucket with a fixed retention window, surviving restarts/downtime around the scheduled time.
- Zero new failure modes for the app: storage misconfiguration degrades to current behavior.

**Non-Goals:**

- No restore automation (manual procedure documented below).
- No point-in-time/continuous replication (that's litestream territory; out of scope).
- No user-facing UI for backups.

## Decisions

### 1. S3 client: `aws4fetch` wrapper in `app/server/storage.ts`

`AwsClient` (sigv4 over native `fetch`) with four helpers: `getObject(key): Buffer`, `putObject(key, buffer)`, `headObject(key): boolean`, `deleteObject(key)`. aws4fetch specifics: the client is constructed with explicit `{ service: 's3', region }` (host-pattern inference fails on non-AWS endpoints like Railway's), and URLs are built by the wrapper itself — `${BUCKET_ENDPOINT}/${BUCKET_NAME}/${key}` path-style (aws4fetch signs requests, it does not assemble S3 URLs). `headObject` returns `false` strictly on 404 and **throws** on anything else (a 403 from bad credentials must surface, not trigger hourly snapshot-and-fail loops). PUTs sign with `UNSIGNED-PAYLOAD` (skips hashing the body; DB snapshot is ~tens of MB — buffered in memory, well within Node limits at our size). No listing API used anywhere, so no XML parsing.

Env (all optional; storage is "configured" only when all four are present):

```
BUCKET_ENDPOINT           https endpoint from the bucket's credentials
BUCKET_NAME
BUCKET_ACCESS_KEY_ID
BUCKET_SECRET_ACCESS_KEY
```

Exact Railway-injected variable names are mapped to these via Railway variable references during cutover (verified against the Credentials tab at implementation time; docs name them per-bucket).

### 2. Bootstrap source resolution

Fixed convention keys: `seed/cities.csv`, `seed/sites.csv`. Resolution per step, inside the existing `runStep` fault boundary:

```
storage configured? → try getObject('seed/cities.csv')
                        └─ on failure: log, fall through ↓
*_CSV_URL set?      → fetchUrlToBuffer(url)      (unchanged path)
else                → skip step (unchanged)
```

S3 *failure* (bad credentials, missing object) falls back to the URL path rather than skipping outright — misconfiguration degrades to today's behavior, not below it. Terminal failures log and skip the step via the existing `runStep` boundary — no new crash paths, no deploy deadlock even against an empty bucket.

### 3. Backup scheduler: plain `setInterval`, no cron dependency

`app/server/backup.ts`, registered in the server entry after `listen`. Every hour (and once at startup):

1. Compute today's key `backups/insights-YYYY-MM-DD.db` (UTC).
2. `headObject(todayKey)` — if it exists, nothing to do. This is the catch-up mechanism: a restart or downtime at the "scheduled" moment self-heals within an hour, and state lives in the bucket, not in process memory.
3. Snapshot (guarded by an in-memory `isBackingUp` flag so ticks never overlap): delete stale `/data/backup.tmp` if present, then `await sqlite.backup('/data/backup.tmp')` (better-sqlite3's online backup API — consistent under WAL, non-blocking for readers), read the file, `putObject`, and unlink the temp in `finally`.
4. Prune a small sliding window: `deleteObject` for keys dated `today − RETENTION` through `today − RETENTION − 2` (three deletes; missing objects are no-ops). The window self-heals strays from short outages spanning midnight; anything older (weeks of downtime) is cosmetic and hand-deletable.

Every cycle is wrapped in try/catch: failures log and the next hourly tick retries. The scheduler never throws into the server.

### 4. Restore procedure (manual, documented in CLAUDE.md)

1. Stop the service (or scale to zero).
2. On the volume: remove `insights.db`, `insights.db-wal`, `insights.db-shm` (stale sidecars from the old file must not meet the restored file).
3. Place the backup as `insights.db`.
4. Start; migrate is a no-op, bootstrap skips (tables populated).

Alternative full-reset path remains: delete the file → bootstrap + CSV re-upload.

### 5. Local development

No bucket vars locally → storage unconfigured → backups disabled (logged once), bootstrap uses `*_CSV_URL` fallback as today. Optionally the dev environment's own bucket credentials can be put in `.env` — same code path as prod.

## Risks / Trade-offs

- [Railway credential variable names differ from assumptions] → mapped via variable references at cutover; env schema owns the canonical names.
- [Backup window is daily — up to 24h of data loss] → acceptable: writes are rare (weekly CSV imports); can tighten the interval later by changing one constant.
- [In-memory buffer of the snapshot (~tens of MB)] → fine at current scale; if the DB ever grows ×100, switch to multipart streaming then.
- [Strays outside the prune horizon] → cosmetic; visible in the bucket UI, deletable by hand.
- [Bucket outage at backup time] → logged, retried hourly; app unaffected.

## Migration Plan

1. Implement storage wrapper + bootstrap resolution + backup scheduler behind optional env; tests for source resolution and backup key/prune logic (pure functions).
2. User: create the Bucket in Railway, upload `cities.csv`/`sites.csv` under `seed/`, wire credential variable references to the app service.
3. Deploy; verify logs: bootstrap unaffected (tables populated → skips), first backup object appears; `headObject` no-op on the next tick.
4. Fresh-env proof: local run with bucket creds + empty DB → bootstrap pulls CSVs from the bucket.
5. Optional: delete the Drive links.

Rollback: remove bucket env vars — the app reverts to URL-fallback behavior; backups simply stop.

## Open Questions

- None blocking. Whether Railway injects credentials automatically on attach vs manual variable references — resolved by looking at the dashboard during step 2.

# Operations

## Deploy

- Railway runs one replica with the SQLite file on a Volume (`DATABASE_PATH`). The old container stops before the new one starts, so brief downtime is expected.
- `railpack.json` runs `npm prune --omit=dev` after the build. The production path must not import a devDependency.
- `.railwayignore` keeps docs, scripts and tests out of the deploy context.
- `.railway/railway.ts` is the Railway configuration: service, volume, bucket, domain and start command. It replaced `railway.json`, which Railway stops reading on 2026-12-01.
- Railway does not read `.railway/` during a deploy, so a push does not apply it. After an edit, run `railway config plan`, check that it lists only the intended changes, then run `railway config apply`.
- The start command is `NODE_ENV=production exec node --import tsx server.ts`. It keeps node as PID 1, so SIGTERM reaches `server.ts`. Through `npm run start`, npm gets the signal and every stop looks like a crash.
- `apply` deletes any service variable missing from the file. List a new variable in `env` with `preserve()` and set its value in Railway.

## Startup

Env validation → open SQLite (WAL, busy_timeout) → Drizzle `migrate()` → enable foreign keys → bootstrap → listen → start the backup and auto charge schedulers. Migrations are in `drizzle/`, generated with `npm run drizzle:generate` from `app/server/db/schema.ts`.

## Bootstrap

- On an empty database the server creates users from `ADMIN_*`/`USER_*`, then cities and sites.
- Reference CSVs come from the bucket (`seed/cities.csv`, `seed/sites.csv`) when `BUCKET_*` is set, else from `CITIES_CSV_URL`/`SITES_CSV_URL`.
- A failed step is logged and skipped; startup continues.
- A local `.env` holds no production values, so `BUCKET_*` stays unset there. With no CSV source a new local database gets users only. Use `npm run dev:sandbox` for a filled one.
- Data CSVs (calls, revenue, expenses, metrics) are uploaded in the app.

## Backups

- With `NODE_ENV=production` and `BUCKET_*` set, the server uploads one snapshot per UTC day to `backups/insights-YYYY-MM-DD.db`. It checks hourly and at startup, and keeps 14 days. Backups under any other name are never pruned.
- Outside production the server logs that backups are off and sets no timer, so a local run cannot take the day's backup. Seed reads from the bucket work in every environment.
- A backup failure is logged and retried; it never affects the app. After a day of failures admins see a red alert in the app. The count starts again when the service restarts.
- No daily backup was made from 2026-10-22 to 2026-10-29. Logs from 2026-10-23 show `S3 HEAD ...: 403` every hour until the 2026-10-30 redeploy. The likely cause: Railway rolled all bucket credentials after its [October 2026 security incident](https://blog.railway.com/p/preliminary-report-october-security-incident), and the running process kept the old ones. After a credential change, redeploy the service.
- Open question: the cause of the earlier gap, from 2026-10-14 to 2026-10-16, is unknown. It ended without a restart.
- Restore: stop the service → on the volume remove `insights.db` and its `-wal`/`-shm` sidecars → place the backup file as `insights.db` → start.

## Auto charges

- The server checks for due estimates at startup and then hourly, in every environment. The job has its own scheduler, because the backup one does not start without bucket storage.
- Each check logs `[auto-charges] schedules checked: N, estimates written: M`. `checked` counts enabled schedules whose number has a site.
- One check is one transaction. A failure logs `[auto-charges] check failed: ...`, writes nothing, and the next tick repeats it. The app keeps working.
- Shutdown stops the timer before the database closes. A check is synchronous, so it cannot be cut off halfway.
- Admins see the red alert `Сверка с Гудком устарела` when estimates are stored and the date behind `Сверено с Гудком до DD.MM` is over 90 days old by the `Europe/Moscow` day. That date is the period end of the last recorded run, or the latest real `telephony` day with no recorded run. Exactly 90 days shows nothing, and with neither date no alert shows. Run the bookmarklet to clear it.

## Gudok call webhook

- Endpoint: `POST`/`GET /webhooks/gudok/:secret` (`app/routes/webhooks.gudok.$secret.ts`).
- Gudok exposes only a URL and a method, so the secret rides in the path. Set `GUDOK_WEBHOOK_SECRET` and configure the project webhook URL as `<APP_URL>/webhooks/gudok/<secret>`, method POST. A wrong or unset secret returns 404.
- Admins see the red alert `Вебхук Гудка молчит` when the latest webhook call was stored over 24 hours ago. Age counts from `updated_at` of rows with `source = 'webhook'`, the time of arrival: CSV rows do not count, and a webhook call that takes over a CSV row keeps the row's `created_at`. Exactly 24 hours shows nothing, and with no webhook calls no alert shows. The value comes from the stored calls, so a restart does not reset it. A day with no calls at all also shows it. Check the webhook URL in Gudok and the `[gudok-webhook]` lines in the service logs. The next stored call clears it.
- After using Gudok's built-in "test" button, find the sample rows and remove them:

```sql
SELECT id, provider_call_id, src, callstatus, date, raw FROM calls ORDER BY created_at DESC LIMIT 5;
DELETE FROM calls WHERE provider = 'gudok' AND provider_call_id IN (...);
```

The test call also creates or updates a row in `phone_numbers`. The query above does not remove it.

### Numbers

- The webhook finds the number by `provider + provider_number_id` (`adv_channel_id` for Gudok), or creates it. A delivery with no `adv_channel_id` creates no number, and the site comes from the project.
- A new number gets its site from `project_id` through `sites.gudok_project_id`, then from the project title. With no match `site_id` stays empty.
- A known number updates `number` and `name` only. Its `site_id` changes by hand only, directly in the database.
- The call is always stored. A number failure is logged, and the call stays idempotent on `provider + provider_call_id`.
- Open question: whether Gudok retries failed deliveries is unknown.

### Rollback of the calls migration

Migration `0003_drop_old_call_tables` removed `calls_old` and `call_imports_old`, so the only way back is a backup taken before that migration. Take a fresh one right before deploying `0003`. To go back:

1. Stop the service.
2. Point it at an image from before `0003`. The current image would drop the tables again at startup.
3. Follow the restore steps in [Backups](#backups).

Calls received after that backup are not in it. Recover them from a Gudok CSV export.

## Gudok telephony expenses

Gudok has no API for charges, so a bookmarklet reads its `/history` page and posts to `/webhooks/gudok/expenses/:secret`. See `scripts/gudok-telephony-bookmarklet.md`.

Both endpoints use `GUDOK_WEBHOOK_SECRET`. A wrong or unset secret returns 404.

`GET /webhooks/gudok/expenses/:secret/since` returns `{ "since": "YYYY-MM-DD" }`: the date of the oldest `telephony` estimate, or the latest stored day when no estimates exist. `since` is `null` when nothing is stored.

`POST /webhooks/gudok/expenses/:secret` takes JSON, sent as `text/plain` to skip the CORS preflight:

```json
{ "operations": [], "period": { "start": "2026-10-01", "end": "2026-10-31" } }
```

| Post | Status | Result |
|---|---|---|
| Valid period, `operations` may be empty | 200 | Runs reconciliation, returns `ok`, `created`, `updated`, `skipped`, `deletedEstimates` |
| No `period`, no `telephony` estimates | 200 | Plain ingest, returns `ok`, `created`, `updated`, `skipped` |
| No `period`, `telephony` estimates exist | 400 | Writes nothing: the old script would add second rows |
| `period` with an invalid date, such as `2026-02-31`, or `start` after `end`, or `null` | 400 | Writes nothing |
| Broken JSON, or `operations` is not a list | 400 | Writes nothing |

- `start` and `end` are `YYYY-MM-DD`, both days included. They may be the same day.
- A 400 or 500 body is `{ "error": "..." }`.
- Every reply, errors included, carries `Access-Control-Allow-Origin: https://in.gudok.tel`, so the bookmarklet can read it.

# Operations

## Deploy

- Railway runs one replica with the SQLite file on a Volume (`DATABASE_PATH`). The old container stops before the new one starts, so brief downtime is expected.
- `railpack.json` runs `npm prune --omit=dev` after the build. The production path must not import a devDependency.
- `.railwayignore` keeps docs, scripts and tests out of the deploy context.

## Startup

Env validation → open SQLite (WAL, busy_timeout) → Drizzle `migrate()` → enable foreign keys → bootstrap → listen. Migrations are in `drizzle/`, generated with `npm run drizzle:generate` from `app/server/schema.ts`.

## Bootstrap

- On an empty database the server creates users from `ADMIN_*`/`USER_*`, then cities and sites.
- Reference CSVs come from the bucket (`seed/cities.csv`, `seed/sites.csv`) when `BUCKET_*` is set, else from `CITIES_CSV_URL`/`SITES_CSV_URL`.
- A failed step is logged and skipped; startup continues.
- Data CSVs (calls, revenue, expenses, metrics) are uploaded in the app.

## Backups

- With `BUCKET_*` set, the server uploads one snapshot per UTC day to `backups/insights-YYYY-MM-DD.db`. It checks hourly and at startup, and keeps 14 days.
- A backup failure is logged and retried; it never affects the app.
- Restore: stop the service → on the volume remove `insights.db` and its `-wal`/`-shm` sidecars → place the backup file as `insights.db` → start.

## Gudok call webhook

- Endpoint: `POST`/`GET /webhooks/gudok/:secret` (`app/routes/webhooks.gudok.$secret.ts`).
- Gudok exposes only a URL and a method, so the secret rides in the path. Set `GUDOK_WEBHOOK_SECRET` and configure the project webhook URL as `<APP_URL>/webhooks/gudok/<secret>`, method POST. A wrong or unset secret returns 404.
- After using Gudok's built-in "test" button, find the sample rows and remove them:

```sql
SELECT id, gudok_id, src, callstatus, date, raw FROM calls ORDER BY created_at DESC LIMIT 5;
DELETE FROM calls WHERE gudok_id IN (...);
```

## Gudok telephony expenses

Gudok has no API for charges, so a bookmarklet reads its `/history` page and posts to `/webhooks/gudok/expenses/:secret`. See `scripts/gudok-telephony-bookmarklet.md`.

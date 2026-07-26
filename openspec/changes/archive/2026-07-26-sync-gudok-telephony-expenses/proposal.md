## Why

Telephony (Gudok number-renewal) charges are a real monthly expense per city, but Gudok exposes them nowhere machine-readable: no API, no CSV export. The costs live only in the authenticated `/history` (Операции) page as an HTML table. We want them in `expenses` so they show up alongside the other costs, without hand-typing每 city every month.

## What Changes

- Add a browser **bookmarklet** the user runs while logged into Gudok's `/history` page. It scrapes the operations table and posts the списание (charge) rows to our app.
- Add a secret-gated ingest endpoint that parses those rows into the `expenses` table as `type = 'telephony'`, resolving each row's project (city) to a site with the existing resolver.
- Make ingest **idempotent and re-runnable**: charges are aggregated per (date, site) and upserted, so re-posting the same days overwrites rather than duplicates. This directly satisfies "не писать дубли".
- Add a companion **"since" endpoint** the bookmarklet queries first: it returns the latest telephony date we already have, so the bookmarklet only expands Gudok's date range back to that day (inclusive) — not to the very bottom every time.

## Capabilities

### New Capabilities

- `telephony-expense-sync`: scrape-and-ingest of Gudok operation charges into `expenses` via a bookmarklet + secret-gated endpoints, idempotent and incremental.

### Modified Capabilities

<!-- none: reuses the expenses table and site resolver as-is -->

## Impact

- New route(s) under `app/routes/` for the ingest + "since" endpoints (mirrors `webhooks.gudok.$secret.ts`).
- New server module `app/server/expenses/gudok-history.ts` (parse rows → aggregate → upsert into `expenses`), reusing `resolveSiteIdByProjectTitle`.
- A bookmarklet source file (checked in, e.g. `docs/` or `scripts/`) the user installs as a browser bookmark.
- No schema change: uses `expenses (date, siteId, amount, type, comment)` and its existing unique keys. Adds CORS handling on the two endpoints since the bookmarklet posts from `https://in.gudok.tel`.

## 1. Server: parse & aggregate

- [x] 1.1 Add `app/server/expenses/gudok-history.ts`: parse one operation row `{ id, date, text, project, kind, amount }` → `{ date: 'YYYY-MM-DD', siteId, amountKopecks, comment }`; amount parser (comma decimal → abs kopecks); project cleaner (strip trailing `.`) reusing `resolveProjectTitle`/`loadCityToSiteId` with prefix-match fallback.
- [x] 1.2 In the same module, `ingestGudokExpenses(rows)`: keep only `Списание`, group by (date, siteId), sum, and upsert one `telephony` expense per group (insert, or update `amount` to the recomputed sum); return `{ created, updated, skipped }`.
- [x] 1.3 Add `latestTelephonyDate()` returning the max `expenses.date` where `type='telephony'`, or null.

## 2. Server: endpoints

- [x] 2.1 Add route `webhooks/gudok/expenses/:secret` (POST ingest, JSON body `{ operations }`) mirroring `webhooks.gudok.$secret.ts`: secret check (404 on mismatch), parse, call `ingestGudokExpenses`, return counts. Register in `app/routes.ts`.
- [x] 2.2 Add route `webhooks/gudok/expenses/:secret/since` (GET) → `{ since }` from `latestTelephonyDate()`.
- [x] 2.3 Add CORS headers (`Access-Control-Allow-Origin: https://in.gudok.tel`) and `OPTIONS` preflight handling to both endpoints.

## 3. Bookmarklet

- [x] 3.1 Add the bookmarklet source (checked-in file) + a short README: app URL/secret placeholders, install steps, and the crawl flow (fetch since → set date range → load-more until past since → scrape `Списание` rows → POST). Document the selectors used.

## 4. Tests & verify

- [x] 4.1 Unit-test the amount parser, project resolver, and `ingestGudokExpenses` aggregation/idempotency using the sample rows (incl. double-post and multi-charge-same-day).
- [x] 4.2 `npm run typecheck`, `npm run lint`, `npm test` pass.
- [ ] 4.3 User runs the bookmarklet on the live Gudok `/history` page and confirms telephony expenses appear (and a second run creates no duplicates).

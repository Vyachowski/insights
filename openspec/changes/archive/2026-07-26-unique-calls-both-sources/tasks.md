## 1. Union both call sources

- [x] 1.1 In `app/server/queries/dashboard.ts`, add imports: `calls` from schema, and `isNotNull` + the union helper (`unionAll`) from drizzle.
- [x] 1.2 Add a `firstCalls(period)` helper that `unionAll`s `{ src, siteId }` from `callImports` (`callNumber = 1`, in period) and `calls` (`callNumber = 1`, `siteId IS NOT NULL`, in period), aliased as a subquery.
- [x] 1.3 Rewrite `fetchCallsTotal` to `count(distinct src)` over `firstCalls(period)`.
- [x] 1.4 Rewrite `fetchCallsByCity`'s per-period query to select from `firstCalls(period)`, inner-join `sites`/`cities`, and `count(distinct src)` grouped by city. Keep the `mergeCallsByCity` call and returned shape unchanged.

## 2. Verify

- [x] 2.1 `npm run typecheck`, `npm run lint`, and `npm test` pass.
- [x] 2.2 Sanity-check the generated SQL against the DB (dev or prod snapshot): total = `count(distinct src)` over the union; a number present in both tables counts once; `siteId IS NULL` webhook rows are excluded.
- [ ] 2.3 On prod data, confirm the Trends «Звонки» total and Calls-by-City counts now include webhook calls and match the unique-first-caller definition.

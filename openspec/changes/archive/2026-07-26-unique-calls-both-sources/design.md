## Context

`fetchCallsTotal` and `fetchCallsByCity` in `app/server/queries/dashboard.ts` both count `call_imports` rows with `callNumber === 1` inside a period; `fetchCallsByCity` additionally joins `sites`/`cities` and groups by city. The webhook table `calls` (same `src`, `callNumber`, `siteId`, `date` columns; `siteId` nullable) is never queried. Both tables store `date` as `timestamp_ms`, so the existing `betweenInstants` predicate works on either.

## Goals / Non-Goals

**Goals**
- Count unique first-callers across `call_imports` ∪ `calls`, deduplicated by `src`.
- Exclude webhook rows with `siteId IS NULL`.
- Keep the returned shapes (`number` for total, `{cityId, city, count}[]` for by-city) and the DTO/widget layer unchanged.

**Non-Goals**
- No schema/migration change; no change to how calls are ingested.
- No change to the comparison window or the widgets.

## Decisions

**A shared "first-calls" union subquery.** Build one `unionAll` of `{ src, siteId }` from the two tables, filtered to `callNumber === 1` within the period, with `isNotNull(calls.siteId)` on the webhook side (imports' `siteId` is already non-null). Reuse it for both queries.

```ts
const firstCalls = (period: Period) => unionAll(
  db.select({ src: callImports.src, siteId: callImports.siteId })
    .from(callImports)
    .where(and(eq(callImports.callNumber, 1), betweenInstants(callImports.date, period))),
  db.select({ src: calls.src, siteId: calls.siteId })
    .from(calls)
    .where(and(eq(calls.callNumber, 1), isNotNull(calls.siteId), betweenInstants(calls.date, period))),
).as('first_calls')
```

**Dedup via `COUNT(DISTINCT src)`.** This guarantees "only the first from each number" across both tables regardless of overlap, and is the query-level expression of the uniqueness requirement.

- Total: `select({ total: sql`count(distinct ${fc.src})` }).from(fc)`.
- By city: `select({ cityId, city, count: sql`count(distinct ${fc.src})` }).from(fc).innerJoin(sites, eq(fc.siteId, sites.id)).innerJoin(cities, ...).groupBy(cities.id)`.

`innerJoin` on `sites` naturally drops any remaining unmatched rows, and the by-city total may legitimately be below the grand total if a number's first-call site differs across sources (rare data edge) — acceptable.

**Why not filter in the DTO/merge layer.** The union+distinct must happen in SQL to dedup across tables efficiently; `mergeCallsByCity` stays as-is (it already hides empty cities).

## Risks / Trade-offs

- `unionAll` subquery typing: `calls.siteId` is nullable and `callImports.siteId` is not; the union column is nullable, which is fine for the join and for the total (the `isNotNull` filter already removed nulls on the webhook side).
- Sum-of-cities vs. total can differ when a caller's first-call rows point at different sites across sources. Documented and accepted; too rare to special-case.

## Migration Plan

Single-commit edit; no migration or flag.

## Open Questions

_None._

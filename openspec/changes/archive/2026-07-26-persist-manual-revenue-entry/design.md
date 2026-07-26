## Context

`app/routes/finance.tsx` already persists manual **hosting expenses** end-to-end: an `AddHostingModal` submits via a `useFetcher` to the route `action` (`intent=add-hosting`), which calls the idempotent `upsertExpense` and returns `{ ok, outcome }`; the component revalidates and shows a toast. The revenue side has the UI shell (`AddRevenueModal`, `RevenueTabView`) but `onModalAdd` only pushes a temp-id row into `localAdds` client state — it never reaches the server, so the entry is lost on reload. The `revenues` table has a unique index on `(date, siteId)` and stores `amount` as integer kopecks.

## Goals / Non-Goals

**Goals:**
- Persist manual revenue adds to the `revenues` table with idempotent `(date, siteId)` semantics.
- Reuse the proven hosting flow (fetcher + action + toast + revalidate) for consistency.
- Admin-only, enforced on the server via `requireAdmin`.

**Non-Goals:**
- No schema change; reuse the existing `revenues` table and unique index.
- No bulk/CSV changes — import already works separately.
- No editing of existing revenue rows beyond the amount-overwrite that idempotency implies.

## Decisions

- **New `app/server/revenues/upsert.ts`** exporting `upsertRevenue({ date, siteId, amount })` → `'created' | 'updated' | 'skipped'`, mirroring `upsertExpense` but keyed on `(date, siteId)` (revenue has no `type`). Existing row + same amount → skip; different amount → update; none → insert. Null `siteId` matched with `isNull`.
- **`action` gains an `add-revenue` intent** alongside `add-hosting`. Validates: `amount > 0`, a non-empty `date` (`YYYY-MM-DD`), optional integer `siteId`. Converts rubles → kopecks with `Math.round(amount * 100)`.
- **Revenue modal submits real data via a fetcher.** `AddRevenueModal` gains `submitting` + an `onSubmit(values)` callback (date, siteId, amount) instead of the current `onAdd(Omit<Revenue,'id'>)`; `RevenueTabView` forwards them. `finance.tsx` wires a `revenueFetcher` with the same toast/revalidate `useEffect` shape as hosting.
- **Drop the client-local revenue path.** Remove `localAdds` and its temp-id insertion for revenue; the table now reflects server state after revalidation. (`removedIds` client-only remove stays as-is — out of scope.)

## Risks / Trade-offs

- Revenue add uses a full user-chosen date (not year-normalized like hosting), so idempotency collapses only exact `(date, siteId)` repeats — intended.
- SQLite treats NULL as distinct in unique indexes, so «Общий» (null site) rows are not constrained by the `(date, siteId)` index; the `upsertRevenue` `isNull` lookup still finds and overwrites an existing null-site row for the same date, keeping behavior idempotent in practice.

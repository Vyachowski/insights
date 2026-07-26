## Why

The «Добавить» button on the Доходы tab looks functional but only inserts a client-local row (temporary negative id via `localAdds`) that disappears on reload — nothing is written to the database. Admins expect the same durable behavior the Расходы tab already has for manual hosting entries.

## What Changes

- Wire the revenue «Добавить» modal to a route `action` that persists the entry to the `revenues` table instead of a throwaway client-local row.
- Add an idempotent `upsertRevenue` helper keyed on `(date, siteId)`, matching the `upsertExpense` pattern and the table's unique index.
- Submit the modal via a `useFetcher`, then revalidate and toast the result (`created` / `updated` / `skipped`), mirroring the hosting flow.
- Remove the client-local `localAdds` / temp-id path for revenue now that adds are real.
- Amount is converted to integer kopecks at the boundary; the full date from the modal is used as-is.

## Capabilities

### New Capabilities
- `manual-revenue-entry`: admin-only manual add of a single revenue row through the Доходы tab, persisted with idempotent `(date, siteId)` upsert semantics, no CSV import.

### Modified Capabilities
<!-- None: no existing spec's requirements change. -->

## Impact

- `app/routes/finance.tsx` — extend `action` to handle an `add-revenue` intent; replace revenue `onModalAdd` local-state path with a fetcher submit; add result toast + revalidate.
- `app/modules/data/AddRevenueModal.tsx` — submit real values (site, date, amount) and reflect a `submitting` state, like `AddHostingModal`.
- `app/modules/data/RevenueTabView.tsx` — pass submit/submitting through to the modal.
- New `app/server/revenues/upsert.ts` (+ test) — idempotent revenue upsert.
- No schema change: reuses `revenues` table and its `(date, siteId)` unique index.

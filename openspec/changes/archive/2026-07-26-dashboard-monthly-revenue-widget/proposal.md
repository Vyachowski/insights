## Why

The dashboard summarizes revenue only as a single yearly figure (Итог / Тренды). There's no view of how revenue moves month to month, nor a simple "сколько в среднем зарабатываем в месяц" number — both are the first things an owner wants at a glance.

## What Changes

- Add a new dashboard widget «Доход по месяцам»: per-month revenue for the current year compared against the same months last year (paired bars, one per month).
- Show an average-monthly-revenue figure inside the same widget (year-to-date revenue ÷ elapsed months), with its delta vs the previous year over the same window.
- Hover on a month reveals exact rubles for both years and the % difference.
- Extend the dashboard loader/query to return the monthly series + averages; no new table or schema change (aggregates the existing `revenues` table).
- No new chart dependency: bars are hand-rolled in the style of the existing `TargetBar`.

## Capabilities

### New Capabilities
- `dashboard-monthly-revenue`: a dashboard widget showing month-by-month revenue current vs previous year plus an average-per-month figure.

### Modified Capabilities
<!-- None: existing dashboard widgets are unchanged. -->

## Impact

- `app/server/queries/dashboard.ts` — add a monthly-revenue aggregation (12 months × current/previous year) and averages; include in `getDashboardSummary`.
- `app/lib/types/dashboard.contract.ts` (+ `types/index.ts`) — new `MonthlyRevenueDto`.
- `app/modules/dashboard/MonthlyRevenueWidget.tsx` (new) — the widget.
- `app/routes/dashboard.tsx` — render the widget.
- Reuses `formatRub` / `formatDeltaPercent` and the `Card` shell for visual consistency.

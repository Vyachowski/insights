## 1. Server: monthly revenue aggregation

- [x] 1.1 In `app/server/queries/dashboard.ts`, add `fetchMonthlyRevenue(currentYear, previousYear)` grouping `revenues.amount` by month for each year (SQLite month extraction), returning 12 points `{ month, current, previous }` in rubles.
- [x] 1.2 Compute `elapsedMonths` (latest current-year month with revenue, fallback current calendar month), `averageCurrent` and `averagePrevious` over months 1..elapsed; guard divide-by-zero.
- [x] 1.3 Add the result to `getDashboardSummary`'s `Promise.all` and return it as `monthlyRevenue`.

## 2. Contract types

- [x] 2.1 Add `MonthlyRevenueDto` (months[] + averageCurrent/averagePrevious/elapsedMonths) to `app/lib/types/dashboard.contract.ts` and re-export from `app/lib/types/index.ts`.

## 3. Widget

- [x] 3.1 Add `app/modules/dashboard/MonthlyRevenueWidget.tsx`: `Card` + header «Доход по месяцам»; average badge («В среднем в месяц», `formatRub(averageCurrent)`, «за N мес» + `formatDeltaPercent` to previous, «—» when no previous).
- [x] 3.2 Render 12 month groups with paired hand-rolled bars (current solid / previous muted) scaled to the max across all points; future months (> elapsed) empty/dashed; month labels Янв…Дек.
- [x] 3.3 Wrap each month in a Mantine `Tooltip` with exact rubles for both years + % diff.
- [x] 3.4 Render `<MonthlyRevenueWidget monthly={monthlyRevenue} />` in `app/routes/dashboard.tsx` after `TrendsWidget`.

## 4. Verify

- [x] 4.1 `npm run typecheck`, `npm run lint`, `npm test` pass.
- [x] 4.2 Manual check: dashboard shows the widget; months read correctly vs the Доходы tab; average = YTD ÷ elapsed months; hover shows both years + %; empty previous year renders «—» without NaN.

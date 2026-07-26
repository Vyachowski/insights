## Context

The archived `dashboard-monthly-revenue-widget` change added `MonthlyRevenueWidget` + `fetchMonthlyRevenue` (per-month revenue, current vs previous year, average-per-month) to the dashboard. `fetchMonthlyTotals(year)` groups `revenues.amount` by month via `substr(date, 6, 2)`. The yearly «Итог» widget already defines profit as revenue − expenses (`fetchPeriodData` sums both; `computeVerdict` uses profit). Expenses in the DB (telephony, hosting) are dated per calendar month; money is integer kopecks → rubles at the boundary.

## Goals / Non-Goals

**Goals:**
- Monthly profit = revenue(month) − expenses(month), current vs previous year, per calendar month.
- Average profit per month (YTD ÷ elapsed) + delta vs last year.
- Sum of monthly profits reconciles to yearly profit (no amortization).
- Render negative months (losses) correctly.

**Non-Goals:**
- No expense amortization / spreading annual costs across months.
- No per-site/per-city breakdown; no schema or data change.

## Decisions

- **Reuse the month-grouping helper for expenses.** Generalize `fetchMonthlyTotals` to take a table/column (or add a sibling `fetchMonthlyExpenseTotals(year)`) that sums `expenses.amount` by month, mirroring the revenue one. Both return `Map<month, rubles>`.
- **Compute profit per month.** `fetchMonthlyProfit(currentYearNum, previousYearNum)`: for each year build revenue and expense month maps, then `months[i] = { month, current: rev.get(m) − exp.get(m), previous: ... }`. Rename the exported `MonthlyRevenueDto` → `MonthlyProfitDto` (same shape: `months[]`, `averageCurrent`, `averagePrevious`, `elapsedMonths`); loader field `monthlyRevenue` → `monthlyProfit`.
- **Elapsed months.** Latest month (1..12) in the current year with any revenue **or** expense (fallback current calendar month). Averages = sum of monthly profit over months 1..elapsed ÷ elapsedMonths, for current and previous year over the same window; guard divide-by-zero (omit delta / «—» when the previous-year average is 0 **and** there was no previous-year activity).
- **Two-sided bars.** Scale by `maxAbs = max(1, max |value| across all 24 points)`. Draw a zero baseline; positive profit grows up (teal), negative grows down (red-ish), for both current (solid) and previous (muted) year. Keep the paired-bars-per-month layout; future months (> elapsed, no data) empty. Tooltip shows both years' profit + % diff; average badge reads «В среднем прибыль в месяц».
- **Rename component** `MonthlyRevenueWidget.tsx` → `MonthlyProfitWidget.tsx`; update the import and field in `dashboard.tsx`. Knip would flag the old file, so delete it rather than leave it.

## Risks / Trade-offs

- Percentages when previous-year profit is negative or zero: `formatDeltaPercent` divides by `Math.abs(previous)` and returns `0%` when previous is 0 — acceptable, but a sign flip (loss→profit) makes % less meaningful; the tooltip still shows both absolute values so the number is never misleading on its own.
- Two-sided bars add layout complexity vs the revenue version, but are required now that values can be negative; scaling by max-abs keeps positive and negative visually comparable.
- No amortization means an annual hosting row dated on one month dips that month's profit; per the decision this is intentional (truthful to the expense's date) and keeps totals reconciling with «Итог».

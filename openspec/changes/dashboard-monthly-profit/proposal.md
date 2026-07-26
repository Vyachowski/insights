## Why

The «Доход по месяцам» widget shows only gross revenue, but the owner wants net profit — revenue minus expenses — per month, to see what's actually earned. Profit is the metric the dashboard already leads with (the «Итог» widget shows yearly profit); the monthly widget should match.

## What Changes

- Rework the monthly widget from **revenue** to **profit**: «Прибыль по месяцам».
- Monthly profit = revenue(month) − expenses(month), grouping both by calendar month (all expense types, including hosting, counted in the month they're dated). No amortization — keeps the math consistent with the yearly «Итог» profit (sum of monthly profits = yearly profit).
- Current year compared against the same months last year, plus an average-profit-per-month figure (YTD profit ÷ elapsed months) with its delta vs last year.
- Profit can be negative, so the bars become two-sided: profit up (teal), loss down (red), around a zero line.
- Server aggregation extended to also sum expenses per month and subtract; DTO renamed to profit.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `dashboard-monthly-revenue`: the widget's metric changes from monthly revenue to monthly profit (revenue − expenses); requirements updated accordingly (aggregation, average, comparison, two-sided/negative rendering).

## Impact

- `app/server/queries/dashboard.ts` — add per-month expense totals; compute monthly profit (rev − exp) for current/previous year and the averages; rename the returned field to `monthlyProfit`.
- `app/lib/types/dashboard.contract.ts` — rename `MonthlyRevenueDto` → `MonthlyProfitDto` (same shape).
- `app/modules/dashboard/MonthlyRevenueWidget.tsx` → `MonthlyProfitWidget.tsx` — header «Прибыль по месяцам», two-sided bars, updated labels/tooltips.
- `app/routes/dashboard.tsx` — render the renamed widget with the renamed loader field.
- No schema or data change; reuses `revenues` and `expenses`.

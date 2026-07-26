## Context

`getDashboardSummary` (`app/server/queries/dashboard.ts`) aggregates revenue only as yearly totals via `fetchPeriodData` (current vs previous year), feeding `VerdictWidget` («Итог», yearly profit) and `TrendsWidget` («Тренды», yearly revenue/expenses/calls). Widgets render inside a shared `Card`, hand-roll bars (`TargetBar`) — there is no chart library — and format money with `formatRub` / deltas with `formatDeltaPercent`. `revenues.date` is text `YYYY-MM-DD` (sorts lexicographically), `amount` is integer kopecks converted to rubles at the query boundary. The dashboard has no monthly view and no average-per-month figure.

## Goals / Non-Goals

**Goals:**
- A standalone widget «Доход по месяцам»: 12 months, current-year revenue paired against the same month last year.
- An average-monthly-revenue figure in the same widget (YTD revenue ÷ elapsed months) with a delta vs the previous year over the same window.
- Exact per-month amounts + % diff on hover.
- No new dependency; visual parity with existing widgets.

**Non-Goals:**
- No per-site or per-city monthly breakdown (portfolio-wide only).
- No expenses/profit monthly view (revenue only, per the request).
- No schema change; no new chart library.

## Decisions

- **Server aggregation.** Add `fetchMonthlyRevenue(currentYear, previousYear)` returning 12 points. Group `revenues` by month with SQLite `strftime('%m', date)` (or `substr(date, 6, 2)`), summing `amount`, for each year separately, then zip into `{ month: 1..12, current, previous }` (rubles). Runs alongside the existing `Promise.all` in `getDashboardSummary`.
- **Elapsed months + averages.** `elapsedMonths` = the latest month (1..12) with any current-year revenue (fallback: current calendar month). `averageCurrent` = sum of current-year revenue for months 1..elapsed ÷ elapsedMonths. `averagePrevious` = sum of previous-year revenue for the same 1..elapsed window ÷ elapsedMonths — apples-to-apples so the delta is fair. When `averagePrevious` is 0, omit the delta (render «—») to avoid divide-by-zero.
- **Contract.** New `MonthlyRevenueDto { months: { month, current, previous }[]; averageCurrent; averagePrevious; elapsedMonths }` in `dashboard.contract.ts`, re-exported from `types/index.ts`; added to the loader return.
- **Widget.** `MonthlyRevenueWidget.tsx` inside a `Card`, header «Доход по месяцам». Right-aligned badge: «В среднем в месяц» + `formatRub(averageCurrent)` + «за {elapsed} мес · {formatDeltaPercent} к 2025». Below: a row of 12 month groups, each with two hand-rolled bars (current = solid accent, previous = muted) scaled to the max value across all 24 data points; future months (> elapsed) rendered empty/dashed. Each month group wrapped in a Mantine `Tooltip` showing both amounts + % diff. Month labels Янв…Дек.
- **Placement.** Render in `dashboard.tsx` after `TrendsWidget` (monthly revenue detail naturally follows the yearly trend), before `CallsByCityWidget`. Trivial to reorder.

## Risks / Trade-offs

- Hand-rolled 12×2 bars are more layout code than a chart lib, but keep the zero-dependency, `TargetBar`-consistent look; acceptable for a fixed 12-bar widget.
- `strftime`/`substr` month grouping assumes well-formed `YYYY-MM-DD` (now enforced for manual entry by the date-validation fix); malformed legacy rows would land in an unexpected bucket — low risk given import validation.
- Average over "months with data" (not fixed 12) can jump early in the year when few months exist; the «за N мес» label makes the denominator explicit to avoid confusion.

## 1. Server: monthly profit aggregation

- [x] 1.1 In `app/server/queries/dashboard.ts`, add per-month expense totals (sum `expenses.amount` by month, mirroring `fetchMonthlyTotals` for revenue).
- [x] 1.2 Add `fetchMonthlyProfit(currentYearNum, previousYearNum)`: monthly profit = revenue(month) − expenses(month) for each year → 12 points `{ month, current, previous }` in rubles.
- [x] 1.3 Elapsed = latest current-year month with any revenue or expense (fallback calendar month); `averageCurrent`/`averagePrevious` = profit over months 1..elapsed ÷ elapsed; guard divide-by-zero.
- [x] 1.4 Replace `monthlyRevenue` with `monthlyProfit` in `getDashboardSummary`'s `Promise.all` and return value.

## 2. Contract types

- [x] 2.1 Rename `MonthlyRevenueDto` → `MonthlyProfitDto` (same shape) in `app/lib/types/dashboard.contract.ts`; update usages.

## 3. Widget

- [x] 3.1 Rename `MonthlyRevenueWidget.tsx` → `MonthlyProfitWidget.tsx`; header «Прибыль по месяцам»; average badge «В среднем прибыль в месяц» + delta / «—».
- [x] 3.2 Two-sided bars: scale by max-abs, zero baseline, positive up (teal) / negative down (red), current solid / previous muted; future months empty; month labels Янв…Дек.
- [x] 3.3 Tooltip shows profit for both years + % diff.
- [x] 3.4 Update `app/routes/dashboard.tsx`: import `MonthlyProfitWidget`, pass `monthly={monthlyProfit}`; delete the old widget file.

## 4. Verify

- [x] 4.1 `npm run typecheck`, `npm run lint`, `npm test`, `npm run knip` pass.
- [x] 4.2 Manual check: monthly profit = revenue − expenses per month (spot-check vs Финансы tabs); sum of months = yearly profit in «Итог»; loss months render downward; average = YTD profit ÷ elapsed; empty previous year → «—» without NaN.

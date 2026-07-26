## 1. Server query

- [ ] 1.1 In `app/server/queries/dashboard.ts`, add a year-to-date window helper: current window is Jan 1 → today; previous window is Jan 1 → the same month-and-day last year (reuse `DateService`/existing period helpers)
- [ ] 1.2 Compute company-wide year-to-date aggregates for both windows: profit, calls, revenue, expenses (kopecks → rubles at the boundary)
- [ ] 1.3 Compute the Verdict figures: average weekly profit for both windows, the year-over-year percentage, the up/down direction, and an `isStrong` flag (|swing| ≥ 20%)
- [ ] 1.4 Compute per-city call counts for both windows (all cities), each as this-year total + previous-year same-window total
- [ ] 1.5 Reshape `getDashboardSummary()` to return `{ verdict, trends, callsByCity }`; drop fields only the retired widgets consumed
- [ ] 1.6 Add/adjust tests for the new aggregates (same-window comparison, kopeck→ruble conversion, empty-period behavior)

## 2. Widgets

- [ ] 2.1 Add a shared `% · абс.` toggle control and a target-line bar component (dashed line + «2025» label, fill vs target, semantic red/green with per-metric inversion, hover value bubble)
- [ ] 2.2 Rework `BusinessHealthWidget` into the Verdict widget (UI label «Итог»): 📉/📈 indicator with «Бизнес [сильно] падает/растёт», hero year-over-year % with «в этом году» tooltip, `% · абс.` toggle showing per-year totals in absolute mode
- [ ] 2.3 Build the Trends widget (UI label «Тренды»): calls / revenue / expenses rows using the target-line bar; expenses color inverted; values on hover
- [ ] 2.4 Build the Calls-by-City widget (UI label «Звонки по городам»): all cities ranked by this-year calls, scrollable, each a target-line bar vs its own previous-year same-window calls; values on hover
- [ ] 2.5 Delete retired widget modules: `WeeklyFinancialMetricsWidget`, `MonthlyProfitComparisonWidget`, `YearlyProfitTrendChart`, `CityProfitShareWidget`, `ExpensesByCategoryWidget`

## 3. Page and navigation

- [ ] 3.1 Update `app/routes/dashboard.tsx` to render Verdict, Trends, Calls-by-City and remove imports of the retired widgets and `useProgressiveMetrics` if unused
- [ ] 3.2 Change the navigation label in `app/navigation/` from «Финансы» to «Сводка» (adjust description text accordingly)

## 4. Verify

- [ ] 4.1 `npm run typecheck`, `npm run lint`, `npm test`, `npm run knip` all pass (knip confirms the deleted widgets/exports are fully removed)
- [ ] 4.2 Load the page against real data and confirm each widget reads correctly (intensity qualifier, red/green thresholds, hover values, city ordering, tooltip totals)
- [ ] 4.3 Archive the change (`openspec archive redesign-main-page-svodka`) once implemented and merged

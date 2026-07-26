## 1. Restructure tab headers

- [x] 1.1 `RevenueTabView.tsx`: keep title `Box` + action buttons (Импорт CSV, Добавить) in the `space-between` header row; move `YearSelect`/`MonthSelect` into a new left-aligned `Group` rendered above the `Paper`, guarded to render only when a filter is available.
- [x] 1.2 `ExpensesTabView.tsx`: same split, including `CategorySelect` in the filter toolbar; action row keeps Импорт CSV.
- [x] 1.3 `MetricsTabView.tsx`: same split (year/month toolbar, Импорт CSV in header row).
- [x] 1.4 `CallsTabView.tsx`: same split (year/month toolbar, Импорт CSV in header row).

## 2. Verify

- [x] 2.1 `npm run typecheck` and `npm run lint` pass.
- [ ] 2.2 Manually confirm on each of the four tabs: buttons sit in the title row, filters form a strip above the table, and the strip disappears when a tab/period has no filter options.

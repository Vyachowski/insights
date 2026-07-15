## 1. Data-page table filters

- [x] 1.1 Rename/extend `useYearFilter` in `app/routes/data.tsx` into `usePeriodFilter`: keep year selection, add month selection derived from entries in the selected year, expose `availableMonths`, `selectedMonth`, `setSelectedMonth`, and filter entries by year + month (month defaults to "all months").
- [x] 1.2 Add a `useCategoryFilter` (or inline derivation) for the expenses tab: distinct `type` values from loaded expenses, `selectedCategory`/`setSelectedCategory`, "all categories" default; apply on top of the period filter for expenses only.
- [x] 1.3 Extend the shared filter-control UI in the tab views to render a month `Select` (all tabs) and a category `Select` (expenses only), wired to the new handlers via `commonProps`.
- [x] 1.4 Verify combined filtering: year + month + category narrow the expenses table correctly; other tabs get year + month only.

## 2. Dashboard Expenses-by-Category widget

- [x] 2.1 Add an `expensesByCategory` query in `app/server/queries/dashboard.ts`: `SUM(amount) GROUP BY type` over the current-month period, convert kopecks→rubles, order by total desc; include it in `getDashboardSummary`'s return.
- [x] 2.2 Create `app/modules/dashboard/ExpensesByCategoryWidget.tsx` rendering category rows (name + ruble amount), with an empty state when there are no expenses.
- [x] 2.3 Render the widget in `app/routes/dashboard.tsx` from the new loader field.

## 3. Wrap-up

- [x] 3.1 Run `npm run typecheck`, `npm run lint`, and `npm test`; fix any fallout.
- [x] 3.2 Verify in the running app (Data tabs filter by month/category; dashboard shows the category widget).
- [x] 3.3 Mark the two V1 ROADMAP items done.

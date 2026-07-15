## Why

The Data page tables already filter by year (`useYearFilter`), but "running the budget" (V1 goal) needs a finer slice — by month and, for expenses, by category (`expenses.type`). The owner also wants an at-a-glance view on the main dashboard of where money goes by category.

## What Changes

- Extend the Data page table filters: add a **month** filter (alongside the existing year filter) to the revenue/expenses/calls/metrics tables, and an **expense-category** filter (`expenses.type`) to the expenses table.
- Category and month options are derived from the data already loaded for the active tab — no schema changes.
- Add a new **Expenses by Category** widget to the main dashboard, showing the expense total per category for the dashboard's period.

## Capabilities

### New Capabilities
- `data-table-filters`: period (year + month) filtering across Data-page tables and expense-category filtering on the expenses table, extending the existing year filter.
- `dashboard-expenses-by-category`: the Expenses-by-Category widget on the main dashboard.

### Modified Capabilities
<!-- No existing spec's requirements change; Data-page table filtering and dashboard widgets are not currently specified at requirement level. -->

## Impact

- `app/routes/data.tsx` — extend `useYearFilter` into period (year + month) filtering; add category filter for the expenses tab; pass options/handlers to tab views.
- `app/modules/data/*TabView` — filter controls render month select; `ExpensesTabView` adds a category select.
- `app/routes/dashboard.tsx` + `app/server/queries/dashboard.ts` — new expenses-by-category aggregation and widget.
- `app/modules/dashboard/` — new `ExpensesByCategoryWidget`.
- No schema or migration changes; category is the existing `expenses.type` column.
- ROADMAP V1 items: "Dashboard filters" (reframed as Data-table filters) and "Expenses by category widget".

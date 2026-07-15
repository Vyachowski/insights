## Context

The Data page (`app/routes/data.tsx`) loads all entries for the active tab into the client and filters them by year with the `useYearFilter` hook — a purely client-side filter over data already in memory. Volumes are small (per-tab, one portfolio). The dashboard (`app/routes/dashboard.tsx`) computes fixed periods server-side in `getDashboardSummary` and has no category breakdown. Expense category is the existing `expenses.type` text column; amounts are integer kopecks converted to rubles at the query boundary.

## Goals / Non-Goals

**Goals:**
- Add a month filter and (for expenses) a category filter to the Data-page tables, consistent with the existing year filter.
- Add an Expenses-by-Category widget to the dashboard for its period.
- No schema or migration changes.

**Non-Goals:**
- No filters on the dashboard itself (reverted from the original idea).
- No budget-vs-actual / planned amounts.
- No server-side pagination or query-level filtering for the tables (the client-side pattern stays).

## Decisions

**1. Extend the client-side filter, don't move filtering to the server.**
`useYearFilter` becomes a broader `usePeriodFilter` (year + month) over the already-loaded entries. Keeps the existing architecture, avoids new loader params and round-trips for datasets that already fit in memory. Alternative — push filters into the loader/SQL — rejected: adds URL/loader plumbing for no user-visible benefit at current volumes.

**2. Month and category options are derived, not configured.**
Month options come from the entries in the selected year; category options come from distinct `expenses.type` in the loaded expenses. No lookup tables, no schema. Matches how `availableYears` already works.

**3. Filter state stays component-local (`useState`), like the current year filter.**
The year filter today is not URL-backed; the month/category filters follow the same pattern to stay consistent. (URL-backing all table filters is a possible later cleanup, out of scope here.)

**4. Expenses-by-Category is aggregated server-side in `getDashboardSummary`.**
Add a query that groups expenses by `type` within the dashboard period (`SUM(amount) GROUP BY type`, kopecks→rubles, order by total desc). Fits the existing `dashboard.ts` query module and returns ready-to-render rows in the loader, matching the other widgets.

**5. Category filter lives only on the expenses tab.**
`type` exists only on expenses; revenue/calls/metrics get the month filter but no category filter. The shared filter-control component renders the category select conditionally.

## Risks / Trade-offs

- [Client-side filtering assumes all entries load] → Already the current behavior; volumes are small. If a tab grows large, revisit with loader-level filtering — tracked as future work, not this change.
- [`expenses.type` is free text — messy/duplicate categories inflate the option list and widget rows] → Acceptable for V1; a category taxonomy is a separate concern. The widget/filter reflect whatever values exist.
- [Dashboard period vs. table period differ] → Intentional: the widget uses the dashboard's own period; table filters are independent. Documented so it isn't read as a bug.

## Open Questions

- None blocking. Category normalization (canonical category list) deferred to a later change if the free-text values prove noisy.

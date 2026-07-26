## Context

All four filtered tab views (`RevenueTabView`, `ExpensesTabView`, `MetricsTabView`, `CallsTabView`) share one header shape: a `<Group justify="space-between">` with a title `Box` on the left and a right-side `<Group gap="sm">` that mixes filter selects (`YearSelect`/`MonthSelect`/`CategorySelect`) with action `Button`s (Импорт CSV, Добавить). Filters render conditionally on available options. The tables sit in a `<Paper>` right below. `Sites`/`Cities` have no filters or import and stay as-is.

## Goals / Non-Goals

**Goals:**
- Move action buttons into the title row (right side); pull filters out into a separate toolbar directly above the table.
- Keep it consistent across all four filtered tabs and collapse the toolbar when empty.

**Non-Goals:**
- No behavior change to filtering, import, or add.
- No redesign of Sites/Cities.
- No new shared component extraction (kept minimal; can follow later if desired).

## Decisions

- **Two rows inside the existing `Stack gap="md"`.** Row 1 stays `Group justify="space-between"`: title `Box` left, a `Group gap="sm"` of just the action buttons right. Row 2 is a new `Group gap="sm"` holding the filter selects, left-aligned, rendered directly before the `<Paper>`.
  - Rationale: matches variant 1 the user picked; the `Stack gap="md"` already spaces rows evenly, so no custom spacing needed.
- **Guard the toolbar so it never renders empty.** Wrap the filter row in a single boolean: render it only when at least one filter would show (e.g. `availableYears.length > 0 || availableMonths.length > 0` and, for expenses, categories). Keeps the layout tight for empty periods per the spec.
  - Alternative considered: always render the row — rejected, leaves a blank strip.
- **No shared component yet.** Edit each of the four views in place. Rationale: the header markup differs slightly per tab (category filter, presence of Добавить), and four small edits are lower-risk than a premature abstraction. Note as a possible follow-up.

## Risks / Trade-offs

- [Four near-duplicate edits could drift over time] → keep the row structure identical across files; a later refactor can extract a `TabHeader`/`FilterBar` if the duplication bites.
- [Left-aligned lone filter toolbar could look bare on wide screens] → acceptable per the chosen variant; the user explicitly opted for the toolbar and can revisit.

## Why

On every Data-page tab the action buttons (Импорт CSV, Добавить) sit in the same right-aligned row as the view filters (год/месяц/категория). Page-level actions and view controls read as one undifferentiated cluster, and the row gets crowded on narrow widths. Separating them makes each tab scan cleaner.

## What Changes

- Split the tab header into two tiers on the tables that have filters (Доходы, Расходы, SEO-метрики, Звонки):
  - **Header row**: title + subtitle on the left, action buttons (Импорт CSV, and Добавить where present) on the right.
  - **Filter toolbar**: the год/месяц/категория selects on their own strip directly above the table, left-aligned.
- The filter toolbar renders only when at least one filter is available, so tabs with no filter options don't show an empty strip.
- Tabs without filters or import (Сайты, Города) keep their current single header row — no change.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `data-table-filters`: add a requirement that the filter controls sit in their own toolbar above the table, visually separated from the page-level action buttons which move into the title row.

## Impact

- `app/modules/data/RevenueTabView.tsx`, `ExpensesTabView.tsx`, `MetricsTabView.tsx`, `CallsTabView.tsx` — restructure the header `Group`.
- No route, loader, action, server, or DTO change. Purely presentational.

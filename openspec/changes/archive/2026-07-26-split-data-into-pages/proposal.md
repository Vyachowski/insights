## Why

The single `Данные` tab crammed six unrelated tables (доходы, расходы, звонки, метрики, города, сайты) behind inner sub-tabs, mixing finances, traffic signals, and portfolio structure in one place. As the app grew past a pure finance tool, that grouping stopped matching how the data is actually used. This change (retroactively documented — already implemented and shipped) records the new top-level page structure so the specs match the running app.

## What Changes

- **BREAKING** (navigation): the `Данные` page (`/data`) is removed and replaced by three top-level pages in the sidebar.
- New page **Финансы** (`/finance`) with inner tabs Доходы + Расходы, carrying the prior import, revenue local-add, and expense-category-filter behavior.
- New page **Трафик** (`/traffic`) with inner tabs Звонки + Метрики.
- New page **Филиалы** (`/branches`) with inner tabs Города + Сайты (reference data).
- Sidebar order becomes: Сводка · Финансы · Трафик · Филиалы.
- Shared `usePeriodFilter` (year/month filter) extracted to `app/hooks/` and reused by the finance and traffic pages.

## Capabilities

### New Capabilities
- `app-navigation`: the top-level page/tab structure of the authenticated app — which sidebar entries exist, their routes, and which data tables each page groups.

### Modified Capabilities
<!-- None: the app, dashboard-summary, data-import, and data-table-filters specs describe layout, widgets, import, and filters — none pin the page grouping being changed here. -->

## Impact

- Routes: `app/routes.ts` (drop `data`, add `finance`/`traffic`/`branches`), new route modules `finance.tsx`, `traffic.tsx`, `branches.tsx`; `app/routes/data.tsx` deleted.
- Navigation: `app/navigation/index.ts` menu items (Wallet/Phone/Building2 icons).
- Hooks: new `app/hooks/usePeriodFilter.ts` (moved out of the former data page).
- Reused unchanged: the tab-view modules under `app/modules/data/` and the import client.
- No schema, query, or import-format changes.

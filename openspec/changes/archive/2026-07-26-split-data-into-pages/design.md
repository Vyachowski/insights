## Context

The app started as a finance tool with two pages (Сводка, Данные). The `Данные` page grew into a six-inner-tab catch-all: доходы, расходы, звонки, метрики, города, сайты. These belong to three different concerns — money, traffic signals, and portfolio reference data — but shared one loader and one screen. This change (already implemented and shipped to `main`) splits them into three top-level pages and records that structure as a spec.

## Goals / Non-Goals

**Goals:**
- One top-level page per concern: finances, traffic, portfolio reference.
- Preserve every existing table behavior (import modals, revenue local-add, expense category filter, period filter).
- No duplication of the shared year/month period filter across the new pages.

**Non-Goals:**
- No changes to table contents, columns, import formats, queries, or schema.
- No change to the Сводка (dashboard) page.
- No new data or capabilities beyond re-grouping existing tables.

## Decisions

- **One route per page, inner Mantine `Tabs` kept.** Each page (`/finance`, `/traffic`, `/branches`) is its own route module with its own loader, retaining the `?tab=` sub-tab pattern the old page used. Alternative — a single parameterized route — was rejected: separate loaders let each page fetch only what it needs (finance/traffic fetch entries + sites; branches fetches cities + sites) and keep URLs meaningful.
- **`usePeriodFilter` extracted to `app/hooks/`.** Finance and traffic both need the year/month filter that lived inline in the old data page. Moving it to a shared hook avoids copy-paste; branches doesn't use it (reference tables have no period).
- **Reuse tab-view modules unchanged.** `RevenueTabView`, `ExpensesTabView`, `CallsTabView`, `MetricsTabView`, `CitiesTabView`, `SitesTabView` under `app/modules/data/` are imported as-is by the new pages.
- **New capability `app-navigation`, not a modification of `app`.** The `app` spec covers repo layout, schema, and deploy; navigation/page structure was never specified. A dedicated capability keeps that concern separate.

## Risks / Trade-offs

- [Old `/data` links and bookmarks break] → No in-app links point to `/data` (verified by grep); the index route redirects to `/dashboard`, so the only cost is stale external bookmarks. Accepted for a solo-dev internal tool.
- [Three loaders repeat the `sites` fetch] → Minor duplication; each page needs sites for its own views, and sharing would re-introduce the coupling this change removes.

## Migration Plan

Already deployed via commit on `main` (routes, navigation, deleted `data.tsx`). This artifact set is retroactive documentation; `/opsx:sync` folds the delta spec into `openspec/specs/app-navigation/`. No data migration.

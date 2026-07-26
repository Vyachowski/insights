## ADDED Requirements

### Requirement: Top-level page structure

The authenticated app SHALL present these top-level pages in the sidebar, in this order: Сводка (`/dashboard`, the summary page), Финансы (`/finance`), Трафик (`/traffic`), and Филиалы (`/branches`). There SHALL NOT be a combined «Данные» page. The index route (`/`) SHALL redirect to `/dashboard`.

#### Scenario: Sidebar entries and order

- **WHEN** an authenticated user views the sidebar
- **THEN** it lists exactly Сводка, Финансы, Трафик, Филиалы in that order, with no «Данные» entry

#### Scenario: Root redirect

- **WHEN** an authenticated user opens `/`
- **THEN** they are redirected to `/dashboard`

### Requirement: Финансы page

The Финансы page (`/finance`) SHALL group the financial data tables as two inner tabs: Доходы (revenue) and Расходы (expenses), defaulting to Доходы. It SHALL retain the CSV import action per tab, the client-local add of a revenue entry, and the expense category filter. The active inner tab SHALL be reflected in the `?tab=` query parameter.

#### Scenario: Finance tabs

- **WHEN** a user opens `/finance`
- **THEN** the page shows the Доходы and Расходы tabs with import available on each, defaulting to Доходы

### Requirement: Трафик page

The Трафик page (`/traffic`) SHALL group the traffic tables as two inner tabs: Звонки (calls) and Метрики (site metrics), defaulting to Звонки, each with its CSV import action. The active inner tab SHALL be reflected in the `?tab=` query parameter.

#### Scenario: Traffic tabs

- **WHEN** a user opens `/traffic`
- **THEN** the page shows the Звонки and Метрики tabs with import available on each, defaulting to Звонки

### Requirement: Филиалы page

The Филиалы page (`/branches`) SHALL group the portfolio reference tables as two inner tabs: Города (cities) and Сайты (sites), defaulting to Города. The active inner tab SHALL be reflected in the `?tab=` query parameter.

#### Scenario: Branches tabs

- **WHEN** a user opens `/branches`
- **THEN** the page shows the Города and Сайты tables as inner tabs, defaulting to Города

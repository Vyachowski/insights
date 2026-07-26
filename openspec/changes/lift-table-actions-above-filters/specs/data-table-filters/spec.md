## ADDED Requirements

### Requirement: Filter controls sit in a toolbar separate from page actions

On the Data-page tables that carry both filters and page-level actions (revenue, expenses, metrics, calls), the filter controls (year, month, and — for expenses — category) SHALL render in their own toolbar directly above the table, and the page-level action buttons (Импорт CSV, and Добавить where present) SHALL render in the header row alongside the table title, not mixed into the filter row. The filter toolbar SHALL be omitted entirely when no filter options are available, so no empty strip appears.

#### Scenario: Actions separated from filters

- **WHEN** a tab with filters and actions is rendered with filter options available
- **THEN** the action buttons appear in the title row and the year/month (and category) selects appear in a toolbar above the table, in a separate row

#### Scenario: No filter options available

- **WHEN** the active tab and period yield no filter options
- **THEN** the filter toolbar is not rendered and no empty row is shown above the table

#### Scenario: Tabs without filters are unaffected

- **WHEN** a tab has no filters (e.g. Сайты, Города)
- **THEN** its header keeps the single title-plus-action row with no separate toolbar

# data-table-filters Specification

## Purpose
Client-side filtering of the Data-page tables so an owner can narrow revenue, expenses, calls, and metrics to a period (year + month) and — for expenses — to a single category (`expenses.type`). Options are derived from the data already loaded for the active tab; no server round-trip or schema is involved.

## Requirements
### Requirement: Month filter on Data-page tables

The Data page SHALL let the user narrow the revenue, expenses, calls, and metrics tables to a single month within the selected year, in addition to the existing year filter. Month options SHALL be derived from the entries present for the active tab and year. The month filter SHALL offer an "all months" choice that shows the whole year.

#### Scenario: Filtering to a single month

- **WHEN** the user selects year 2026 and month "March" on the expenses tab
- **THEN** the table shows only expenses dated in March 2026

#### Scenario: All months selected

- **WHEN** the user selects a year and leaves the month at "all months"
- **THEN** the table shows every entry in that year, matching the year-only behavior

#### Scenario: Month options follow the data

- **WHEN** the selected year has entries only in January and February
- **THEN** the month filter offers only January and February (plus "all months")

### Requirement: Category filter on the expenses table

The expenses table SHALL let the user narrow rows to a single expense category (`expenses.type`). Category options SHALL be the distinct `type` values present in the loaded expenses. The filter SHALL offer an "all categories" choice.

#### Scenario: Filtering by category

- **WHEN** the user selects the category "Реклама" on the expenses tab
- **THEN** the table shows only expenses whose `type` is "Реклама"

#### Scenario: All categories selected

- **WHEN** the category filter is left at "all categories"
- **THEN** the table shows expenses of every category (subject to the active year/month filter)

#### Scenario: Category combines with period

- **WHEN** the user selects year 2026, month "March", and category "Реклама"
- **THEN** the table shows only March 2026 expenses whose `type` is "Реклама"

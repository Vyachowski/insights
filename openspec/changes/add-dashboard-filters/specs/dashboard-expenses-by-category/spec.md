## ADDED Requirements

### Requirement: Expenses by Category widget

The main dashboard SHALL show an Expenses-by-Category widget that lists each expense category (`expenses.type`) with its total amount for the dashboard's period. Amounts SHALL be presented in rubles (stored kopecks divided by 100). Categories SHALL be ordered by total, largest first.

#### Scenario: Widget lists category totals

- **WHEN** the period has expenses "Реклама" 30000 ₽ and "Аренда" 50000 ₽
- **THEN** the widget shows "Аренда" 50000 ₽ above "Реклама" 30000 ₽

#### Scenario: No expenses in the period

- **WHEN** the period has no expenses
- **THEN** the widget renders an empty state instead of category rows

#### Scenario: Amounts shown in rubles

- **WHEN** a category total is stored as 5000000 kopecks
- **THEN** the widget displays 50000 ₽

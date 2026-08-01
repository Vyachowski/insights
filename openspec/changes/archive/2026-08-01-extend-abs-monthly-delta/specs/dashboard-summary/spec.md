## MODIFIED Requirements

### Requirement: Value mode toggle

Each summary widget SHALL provide a toggle offering two value modes, percent and absolute (UI labels `%` and `абс.`), defaulting to percent. In percent mode a value SHALL be shown as its share-of-reference or year-over-year percentage; in absolute mode it SHALL be shown as the signed average per-month year-over-year difference — this year's year-to-date total minus last year's same-window total, divided by the elapsed months, suffixed «/мес» (rubles for money, count for calls) — NOT a cumulative total. All widgets SHALL use the same elapsed-months definition so their per-month figures are comparable. The toggle SHALL be placed in the top-right of each widget and SHALL use identical labels across all three widgets.

#### Scenario: Default and switch

- **WHEN** a summary widget first renders
- **THEN** it shows percent values, and switching the toggle to absolute shows the signed average per-month year-over-year difference suffixed «/мес»

### Requirement: Trends widget

The Trends widget SHALL show three metric rows — calls, revenue, expenses (UI labels «Звонки», «Доходы», «Расходы») — each as a bar with a target line marking the previous year's level for the same year-to-date window. For calls and revenue the bar SHALL be red while below the target line and green once it reaches or passes it; for expenses the coloring SHALL be inverted (green while below the line, red once it passes it). Profit SHALL NOT appear here (it is the Verdict widget). Each row's bar SHALL carry a tooltip: in percent mode the year-over-year delta label; in absolute mode the signed average per-month year-over-year difference — this year's year-to-date total minus last year's, divided by the elapsed months — suffixed «/мес», as rubles for «Доходы»/«Расходы» and a count for «Звонки».

#### Scenario: Revenue below last year

- **WHEN** revenue year-to-date is below last year's same-window level
- **THEN** the revenue bar is red and its fill stops short of the target line

#### Scenario: Expenses above last year

- **WHEN** expenses year-to-date exceed last year's same-window level
- **THEN** the expenses bar is red and its fill extends past the target line

#### Scenario: Profit excluded

- **WHEN** the Trends widget renders
- **THEN** it shows only calls, revenue, and expenses rows and no profit row

#### Scenario: Absolute-mode tooltip shows the per-month difference

- **WHEN** the widget is switched to absolute mode and the user hovers a row's bar
- **THEN** the tooltip shows the signed average per-month year-over-year difference suffixed «/мес» (a ruble amount for «Доходы»/«Расходы», a count for «Звонки») — not this year's cumulative total

### Requirement: Calls-by-City widget

The Calls-by-City widget SHALL list only cities that have at least one call in the current year-to-date window or the previous-year same window; cities with zero calls in both windows SHALL be hidden. The listed cities SHALL be ranked by this year's call count (cumulative since January 1) in descending order, in a scrollable list. Calls SHALL be the only per-city metric shown (no revenue or expenses per city). Each city SHALL use the same target-line bar as the Trends widget, where the target is that city's own previous-year call count for the same year-to-date window (red below the line, green at or past it). Each city's bar SHALL carry a tooltip: in percent mode the year-over-year delta label; in absolute mode the signed average per-month year-over-year call-count difference — this city's year-to-date calls minus last year's, divided by the elapsed months — suffixed «/мес».

#### Scenario: Ranking by current-year calls

- **WHEN** city A has more year-to-date calls than city B
- **THEN** city A appears above city B in the list

#### Scenario: City ahead of its own last year

- **WHEN** a city's year-to-date calls exceed its previous-year same-window calls
- **THEN** its bar is green and its fill passes the target line

#### Scenario: Empty cities hidden

- **WHEN** a city has zero calls in both the current and previous year-to-date windows
- **THEN** it does not appear in the list

#### Scenario: Cities with data listed

- **WHEN** the cities that have calls in either window exceed what fits on screen
- **THEN** the widget lists all of those cities in a scrollable container

#### Scenario: Absolute-mode tooltip shows the per-month difference

- **WHEN** the widget is switched to absolute mode and the user hovers a city's bar
- **THEN** the tooltip shows the signed average per-month year-over-year call-count difference suffixed «/мес» — not this year's cumulative count

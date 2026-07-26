# dashboard-summary Specification

## Purpose
The main page («Сводка») — an at-a-glance summary that answers "are we growing or shrinking, is it a trend or a one-off, and which cities lead". It replaces the former finance-widget stack with three widgets (Verdict, Trends, Calls-by-City) sharing one comparison model: the current year-to-date window against the same calendar window of the previous year, where parity equals 100%.

## Requirements
### Requirement: Summary page identity

The main page (index route) SHALL be a summary page (UI label «Сводка») rather than a finance view. It SHALL render exactly three widgets in order: the Verdict widget (UI label «Итог»), the Trends widget (UI label «Тренды»), and the Calls-by-City widget (UI label «Звонки по городам»). It SHALL NOT render the retired widgets (weekly financial metrics, monthly profit comparison, yearly profit trend chart, city profit share, expenses by category).

#### Scenario: Tab label and widget set

- **WHEN** an authenticated user opens the main page
- **THEN** the navigation entry reads «Сводка» and the page shows the Verdict, Trends, and Calls-by-City widgets and none of the retired widgets

### Requirement: Year-to-date vs previous-year comparison model

All summary widgets SHALL compare the current year-to-date window (January 1 → today) against the same calendar window of the previous year (January 1 → the same month-and-day). Parity with the previous year's same-window value SHALL be treated as 100% (the reference). The comparison SHALL NOT use the previous year's full-year total as the reference.

#### Scenario: Same-window comparison

- **WHEN** today is 26 July and a metric totals 980 for Jan 1 – Jul 26 this year and 875 for Jan 1 – Jul 26 last year
- **THEN** the metric is reported as 112% of the previous year (above the 100% reference)

#### Scenario: Full-year total is not the reference

- **WHEN** the previous year's full-year total exceeds its Jan 1 – today partial total
- **THEN** the comparison still uses the partial same-window total, so a mid-year metric is not forced below 100% merely because the year is incomplete

### Requirement: Value mode toggle

Each summary widget SHALL provide a toggle offering two value modes, percent and absolute (UI labels `%` and `абс.`), defaulting to percent. In percent mode a value SHALL be shown as its share-of-reference or year-over-year percentage; in absolute mode it SHALL be shown as the cumulative absolute total since January 1 (rubles for money, count for calls). The toggle SHALL be placed in the top-right of each widget and SHALL use identical labels across all three widgets.

#### Scenario: Default and switch

- **WHEN** a summary widget first renders
- **THEN** it shows percent values, and switching the toggle to absolute shows the cumulative absolute totals since January 1

### Requirement: Verdict widget

The Verdict widget SHALL show a growth indicator and a hero figure for average weekly profit compared year-over-year. The indicator SHALL read «Бизнес растёт» when profit is up and «Бизнес падает» when down, with a 📈/📉 icon. When the absolute year-over-year swing is at least 20%, the qualifier «сильно» SHALL be inserted («Бизнес сильно растёт/падает»); below 20% it SHALL be omitted. The hero figure in percent mode SHALL be the year-over-year percentage with a «в этом году» label whose tooltip lists each year's total; in absolute mode it SHALL show this year's and last year's totals.

#### Scenario: Strong decline

- **WHEN** average weekly profit is 25% below last year
- **THEN** the indicator reads «Бизнес сильно падает» with the 📉 icon and the hero shows the negative percentage

#### Scenario: Mild growth

- **WHEN** average weekly profit is 8% above last year
- **THEN** the indicator reads «Бизнес растёт» (no «сильно») with the 📈 icon

#### Scenario: Tooltip totals

- **WHEN** the user hovers the «в этом году» label
- **THEN** a tooltip shows this year's and last year's totals for the comparable window

### Requirement: Trends widget

The Trends widget SHALL show three metric rows — calls, revenue, expenses (UI labels «Звонки», «Доходы», «Расходы») — each as a bar with a target line marking the previous year's level for the same year-to-date window. For calls and revenue the bar SHALL be red while below the target line and green once it reaches or passes it; for expenses the coloring SHALL be inverted (green while below the line, red once it passes it). Profit SHALL NOT appear here (it is the Verdict widget).

#### Scenario: Revenue below last year

- **WHEN** revenue year-to-date is below last year's same-window level
- **THEN** the revenue bar is red and its fill stops short of the target line

#### Scenario: Expenses above last year

- **WHEN** expenses year-to-date exceed last year's same-window level
- **THEN** the expenses bar is red and its fill extends past the target line

#### Scenario: Profit excluded

- **WHEN** the Trends widget renders
- **THEN** it shows only calls, revenue, and expenses rows and no profit row

### Requirement: Calls-by-City widget

The Calls-by-City widget SHALL list every city, ranked by this year's call count (cumulative since January 1) in descending order, in a scrollable list. Calls SHALL be the only per-city metric shown (no revenue or expenses per city). Each city SHALL use the same target-line bar as the Trends widget, where the target is that city's own previous-year call count for the same year-to-date window (red below the line, green at or past it).

#### Scenario: Ranking by current-year calls

- **WHEN** city A has more year-to-date calls than city B
- **THEN** city A appears above city B in the list

#### Scenario: City ahead of its own last year

- **WHEN** a city's year-to-date calls exceed its previous-year same-window calls
- **THEN** its bar is green and its fill passes the target line

#### Scenario: All cities listed

- **WHEN** the portfolio has more cities than fit on screen
- **THEN** the widget lists all of them in a scrollable container

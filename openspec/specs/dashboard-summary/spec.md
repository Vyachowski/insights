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

Each summary widget SHALL provide a toggle offering two value modes, percent and absolute (UI labels `%` and `абс.`), defaulting to percent. In percent mode a value SHALL be shown as its share-of-reference or year-over-year percentage; in absolute mode it SHALL be shown as the cumulative absolute total since January 1 (rubles for money, count for calls), EXCEPT the Verdict widget's hero figure, whose absolute mode shows the signed average per-month year-over-year difference (see the Verdict widget requirement). The toggle SHALL be placed in the top-right of each widget and SHALL use identical labels across all three widgets.

#### Scenario: Default and switch

- **WHEN** a summary widget first renders
- **THEN** it shows percent values, and switching the toggle to absolute shows the cumulative absolute totals since January 1

### Requirement: Verdict widget

The Verdict widget SHALL show a growth indicator and a hero figure for average weekly profit compared year-over-year. The indicator SHALL read «Бизнес растёт» when profit is up and «Бизнес падает» when down, with a 📈/📉 icon. When the absolute year-over-year swing is at least 20%, the qualifier «сильно» SHALL be inserted («Бизнес сильно растёт/падает»); below 20% it SHALL be omitted. The hero figure in percent mode SHALL be the year-over-year percentage; in absolute mode it SHALL be the average per-month year-over-year profit difference — this year's average monthly profit minus last year's over the elapsed months — shown as a signed ruble amount with a `+`/`−` sign and a «/мес» suffix, NOT this year's whole total. In both modes the hero figure's sign and color SHALL agree (negative → `−`, red; positive → `+`, teal). The hero SHALL carry a «в среднем за год» label whose tooltip lists each year's total, one year per line with the amounts aligned for comparison, plus one line stating the average per-month loss or gain versus last year.

#### Scenario: Strong decline

- **WHEN** average weekly profit is 25% below last year
- **THEN** the indicator reads «Бизнес сильно падает» with the 📉 icon and the hero shows the negative percentage

#### Scenario: Mild growth

- **WHEN** average weekly profit is 8% above last year
- **THEN** the indicator reads «Бизнес растёт» (no «сильно») with the 📈 icon

#### Scenario: Absolute mode shows the per-month difference

- **WHEN** the widget is switched to absolute mode and this year's average monthly profit is below last year's
- **THEN** the hero shows the signed average per-month difference (this year minus last year) as a negative ruble amount suffixed «/мес» in red — not this year's whole total and not the full year-over-year difference

#### Scenario: Hero label

- **WHEN** the widget renders in either percent or absolute mode
- **THEN** the hero figure is labeled «в среднем за год»

#### Scenario: Tooltip totals

- **WHEN** the user hovers the «в среднем за год» label
- **THEN** a tooltip shows this year's and last year's totals for the comparable window, each year on its own line with the amounts aligned so their magnitudes are easy to compare, plus a line stating the average per-month loss or gain versus last year

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

The Calls-by-City widget SHALL list only cities that have at least one call in the current year-to-date window or the previous-year same window; cities with zero calls in both windows SHALL be hidden. The listed cities SHALL be ranked by this year's call count (cumulative since January 1) in descending order, in a scrollable list. Calls SHALL be the only per-city metric shown (no revenue or expenses per city). Each city SHALL use the same target-line bar as the Trends widget, where the target is that city's own previous-year call count for the same year-to-date window (red below the line, green at or past it).

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

### Requirement: Year-over-year delta label

Where a summary widget shows a year-over-year change label against the previous year (the Trends metric rows and the Calls-by-City rows in percent mode), the label SHALL be computed from the current and previous-year same-window values as follows: when the previous-year value is non-zero, the label SHALL show the signed rounded percentage followed by «к <previous year>» (e.g. «+12% к 2025»); when the previous-year value is zero and the current value is non-zero, the label SHALL read «новый», because there is no prior baseline to form a percentage; when both values are zero, the label SHALL read «—». The previous-year number in the suffix SHALL be derived from the current date, not hardcoded.

#### Scenario: Growth over a real baseline

- **WHEN** the previous-year value is non-zero
- **THEN** the label shows the signed percentage with the «к <previous year>» suffix (e.g. «−5% к 2025»)

#### Scenario: No prior-year baseline

- **WHEN** the previous-year value is zero and the current value is non-zero
- **THEN** the label reads «новый» and does not read «0%»

#### Scenario: No data in either year

- **WHEN** both the current and previous-year values are zero
- **THEN** the label reads «—»

### Requirement: Unique first-call counting across sources

Every summary call count (the Trends «Звонки» total and the Calls-by-City per-city counts) SHALL count unique first-time callers drawn from both call sources: the imported-calls table and the webhook-calls table. A row SHALL be eligible only when it is a first call from its number (Gudok call number equal to 1) and falls within the comparison window. Eligible rows from the two sources SHALL be combined and deduplicated by caller phone number, so a number present in both sources is counted once. Webhook calls not matched to a site SHALL be excluded from every count.

#### Scenario: Both sources contribute

- **WHEN** a site has first calls recorded in the imported-calls table and other first calls recorded only via the webhook
- **THEN** both contribute to the site's city count and to the total

#### Scenario: Same number in both tables counted once

- **WHEN** the same caller number has a first-call row in both the imported and the webhook table within the window
- **THEN** it is counted once, not twice

#### Scenario: Non-first calls excluded

- **WHEN** a number's row has a Gudok call number greater than 1
- **THEN** it is not counted

#### Scenario: Unmatched webhook calls excluded

- **WHEN** a webhook call is not matched to a site
- **THEN** it is excluded from the total and from every city count


## MODIFIED Requirements

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

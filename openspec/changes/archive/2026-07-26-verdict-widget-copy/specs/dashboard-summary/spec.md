## MODIFIED Requirements

### Requirement: Verdict widget

The Verdict widget SHALL show a growth indicator and a hero figure for average weekly profit compared year-over-year. The indicator SHALL read «Бизнес растёт» when profit is up and «Бизнес падает» when down, with a 📈/📉 icon. When the absolute year-over-year swing is at least 20%, the qualifier «сильно» SHALL be inserted («Бизнес сильно растёт/падает»); below 20% it SHALL be omitted. The hero figure in percent mode SHALL be the year-over-year percentage; in absolute mode it SHALL be this year's absolute total. In both modes the hero figure SHALL carry a «в среднем за год» label whose tooltip lists each year's total, one year per line with the amounts aligned for comparison.

#### Scenario: Strong decline

- **WHEN** average weekly profit is 25% below last year
- **THEN** the indicator reads «Бизнес сильно падает» with the 📉 icon and the hero shows the negative percentage

#### Scenario: Mild growth

- **WHEN** average weekly profit is 8% above last year
- **THEN** the indicator reads «Бизнес растёт» (no «сильно») with the 📈 icon

#### Scenario: Hero label

- **WHEN** the widget renders in either percent or absolute mode
- **THEN** the hero figure is labeled «в среднем за год»

#### Scenario: Tooltip totals

- **WHEN** the user hovers the «в среднем за год» label
- **THEN** a tooltip shows this year's and last year's totals for the comparable window, each year on its own line with the amounts aligned so their magnitudes are easy to compare

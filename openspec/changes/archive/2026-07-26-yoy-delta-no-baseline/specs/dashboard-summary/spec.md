## ADDED Requirements

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

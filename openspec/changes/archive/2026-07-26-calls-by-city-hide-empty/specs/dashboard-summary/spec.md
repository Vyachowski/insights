## MODIFIED Requirements

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

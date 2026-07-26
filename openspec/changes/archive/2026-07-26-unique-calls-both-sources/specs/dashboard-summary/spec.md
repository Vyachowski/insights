## ADDED Requirements

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

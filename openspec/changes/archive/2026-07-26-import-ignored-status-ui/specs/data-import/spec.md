## ADDED Requirements

### Requirement: Import result feedback reflects the outcome

The import UI SHALL render the result banner (color, icon, and message) derived from the `{ created, updated, skipped }` counts, so that adding data, ignoring all rows, a mixed outcome, and failure are visually distinct. This applies uniformly to every import resource (calls, revenue, expenses, metrics), all of which share the same modal and result shape.

The status SHALL be computed as:

- **Success** — at least one row created or updated and none skipped: green banner with a check icon.
- **Ignored** — every affected row skipped (no rows created or updated): amber/yellow banner with a warning icon.
- **Mixed** — at least one row created or updated and at least one skipped: amber/yellow banner listing both counts.
- **Empty** — no rows created, updated, or skipped: neutral "no changes" message.
- **Error** — the import request failed: red banner with an X icon (unchanged).

#### Scenario: All rows added

- **WHEN** an import creates rows and skips none
- **THEN** the banner is green with a check icon and reports the created (and any updated) count

#### Scenario: All rows ignored as duplicates

- **WHEN** an import creates and updates no rows and skips every row
- **THEN** the banner is amber with a warning icon and reports the skipped count as ignored

#### Scenario: Mixed outcome

- **WHEN** an import creates or updates some rows and skips others
- **THEN** the banner is amber and lists both the created/updated count and the skipped count

#### Scenario: Import fails

- **WHEN** the import request errors
- **THEN** the banner is red with an X icon and shows the error message

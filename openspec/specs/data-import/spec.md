# data-import Specification

## Purpose
How data enters the system: admin-only CSV imports (multipart upload and by-URL, dispatched by intent through route actions) for the data resources (calls, revenue, expenses, metrics), and startup bootstrap of reference data (users, cities, sites) from environment configuration. There is no seed subsystem; a fresh database becomes fully usable via bootstrap + uploads.
## Requirements
### Requirement: Data resources are importable via CSV upload and URL

Each data resource (calls, revenue, expenses, metrics) SHALL be importable by admins through route actions: a multipart CSV file upload and a fetch-by-URL variant, dispatched by an `intent` form field. Both paths SHALL run the same parse-and-insert pipeline and report `{ created, skipped }` counts back to the page via action data. Inserts SHALL be duplicate-safe (`onConflictDoNothing`), so re-importing the same file is idempotent. Admin authorization SHALL be enforced by `requireAdmin` inside the action.

#### Scenario: Admin uploads a CSV file

- **WHEN** an admin submits a valid CSV through the import UI
- **THEN** the route action parses rows, inserts valid records, skips duplicates, and the page renders `{ created, skipped }` from action data

#### Scenario: Same file imported twice

- **WHEN** the same CSV is imported a second time
- **THEN** no duplicate records are created and the result reports all rows as skipped

#### Scenario: Non-admin attempts an import

- **WHEN** a USER-role session submits an import
- **THEN** the action rejects with 403 and performs no work

### Requirement: CSV imports validate structure and reject noisy files

CSV import SHALL fail fast with a validation error naming the missing columns when the file is empty or lacks any of the resource's required columns; extra columns SHALL be ignored (real exports, e.g. Gudok call logs, carry more columns than the import consumes). After row mapping, the import SHALL fail if more than 50% of rows were invalid (skip-rate guard), preventing silent acceptance of a wrong or corrupted file. Validation failures SHALL surface to the import UI as readable error messages, not error boundaries.

#### Scenario: Missing columns

- **WHEN** a CSV is imported that lacks one or more required columns
- **THEN** the import fails with an error listing the missing columns and no rows are inserted

#### Scenario: Extra columns

- **WHEN** a CSV containing all required columns plus extra ones is imported
- **THEN** the extra columns are ignored and the import proceeds

#### Scenario: Mostly-invalid file

- **WHEN** more than half of the rows in a CSV fail row-level validation
- **THEN** the import fails with an error reporting the invalid-row count

### Requirement: Reference data bootstraps on startup from environment configuration

On server startup, before the app begins serving requests, the system SHALL bootstrap reference data in order — users, cities, sites — with each step running only if its table is empty:

- **Users**: create an admin and a regular user from the `ADMIN_*` and `USER_*` env vars (email, name, lastname, password), with passwords hashed via argon2. No credentials or hashes are stored in the repository.
- **Cities / Sites**: fetch the reference CSV from the project bucket (`seed/cities.csv`, `seed/sites.csv`) when bucket storage is configured; on bucket failure or absence, fall back to the plain-URL source (`CITIES_CSV_URL`/`SITES_CSV_URL`); when no source is configured, or every configured source fails, skip the step (logged). Rows are inserted preserving their explicit `id` values (sites only after cities exist).

Explicit-id inserts SHALL leave the autoincrement state consistent so subsequent inserts do not collide (SQLite `AUTOINCREMENT` maintains this automatically; no manual sequence reset exists).

#### Scenario: Fresh database with bucket configured

- **WHEN** the server starts against an empty database with bucket credentials set and seed CSVs present in the bucket
- **THEN** cities and sites are loaded from the bucket, and an admin can log in and upload data CSVs immediately

#### Scenario: Bucket misconfigured, URL fallback available

- **WHEN** the bucket fetch fails (bad credentials or missing object) and `CITIES_CSV_URL` is set
- **THEN** the step logs the bucket failure and completes using the plain-URL source

#### Scenario: Populated database

- **WHEN** the server starts and the User, City, and Site tables are non-empty
- **THEN** every bootstrap step is skipped and no external fetches occur

### Requirement: Bootstrap is fault-tolerant and never blocks startup

A missing bootstrap env var or a failed CSV fetch SHALL cause that bootstrap step to be skipped with a logged error identifying the step and cause; the application SHALL continue starting and serving requests.

#### Scenario: CSV URL unreachable

- **WHEN** `CITIES_CSV_URL` is set but the fetch fails at startup
- **THEN** the cities step is skipped, an error is logged naming the step and HTTP status, and the app finishes startup normally

#### Scenario: Bootstrap env vars absent

- **WHEN** the app starts with no bootstrap env vars set
- **THEN** all bootstrap steps are skipped with log messages and the app starts normally

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


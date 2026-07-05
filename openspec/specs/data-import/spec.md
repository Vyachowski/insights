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
- **Cities**: fetch a CSV from `CITIES_CSV_URL` and insert rows preserving their explicit `id` values.
- **Sites**: fetch a CSV from `SITES_CSV_URL` (only after cities exist) and insert rows preserving their explicit `id` values.

After inserting rows with explicit ids, the system SHALL reset the corresponding Postgres identity sequences so subsequent inserts do not collide.

#### Scenario: Fresh database

- **WHEN** the server starts against an empty database with all bootstrap env vars set
- **THEN** users, cities, and sites are created, sequences are reset, and an admin can log in and upload data CSVs immediately

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

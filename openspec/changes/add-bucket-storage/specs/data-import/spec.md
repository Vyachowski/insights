# data-import Specification (delta)

## MODIFIED Requirements

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

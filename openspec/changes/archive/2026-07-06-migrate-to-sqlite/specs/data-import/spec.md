# data-import Specification (delta)

## MODIFIED Requirements

### Requirement: Reference data bootstraps on startup from environment configuration

On server startup, before the app begins serving requests, the system SHALL bootstrap reference data in order — users, cities, sites — with each step running only if its table is empty:

- **Users**: create an admin and a regular user from the `ADMIN_*` and `USER_*` env vars (email, name, lastname, password), with passwords hashed via argon2. No credentials or hashes are stored in the repository.
- **Cities**: fetch a CSV from `CITIES_CSV_URL` and insert rows preserving their explicit `id` values.
- **Sites**: fetch a CSV from `SITES_CSV_URL` (only after cities exist) and insert rows preserving their explicit `id` values.

Explicit-id inserts SHALL leave the autoincrement state consistent so subsequent inserts do not collide (SQLite `AUTOINCREMENT` maintains this automatically; no manual sequence reset exists).

#### Scenario: Fresh database

- **WHEN** the server starts against an empty database with all bootstrap env vars set
- **THEN** users, cities, and sites are created, and an admin can log in and upload data CSVs immediately

#### Scenario: Populated database

- **WHEN** the server starts and the User, City, and Site tables are non-empty
- **THEN** every bootstrap step is skipped and no external fetches occur

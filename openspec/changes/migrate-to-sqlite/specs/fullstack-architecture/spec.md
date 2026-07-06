# fullstack-architecture Specification (delta)

## MODIFIED Requirements

### Requirement: Server-only modules are isolated

Database access, auth, bootstrap, env validation, and CSV import logic SHALL live in server-only modules (`app/server/`), never imported into client components. The database SHALL be SQLite (better-sqlite3) opened from `DATABASE_PATH` with WAL journal mode and busy timeout; foreign-key enforcement is enabled after migrations complete. The database schema SHALL be a single Drizzle TS file (sqlite-core) keeping the existing table/column names; money amounts are stored as integer kopecks and converted to rubles at the query boundary; `drizzle-kit` SHALL own migrations.

#### Scenario: Schema change

- **WHEN** a table or column changes in the Drizzle schema
- **THEN** `drizzle-kit generate` produces the SQL migration (dev-time), and the programmatic Drizzle migrator applies pending migrations in the server entry on startup/deploy

#### Scenario: Import runs while the dashboard is read

- **WHEN** an admin runs a large CSV import while another session loads the dashboard
- **THEN** the dashboard request completes successfully (no `SQLITE_BUSY` error surfaces to either session)

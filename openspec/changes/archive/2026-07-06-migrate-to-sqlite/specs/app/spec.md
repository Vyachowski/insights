# app Specification (delta)

## MODIFIED Requirements

### Requirement: Workspace and Repository Layout

The project SHALL be a flat single-package repository (no npm workspaces): one root `package.json`, the React Router 7 app under `app/` (routes, modules, server code), Drizzle migrations under `drizzle/`, the local SQLite database under `data/` (ignored via `data/*` + `!data/.gitkeep`, which also covers the `-wal`/`-shm` sidecar files), and OpenSpec docs under `openspec/`.

#### Scenario: Single install and dev flow

- **WHEN** a developer clones the repo and runs `npm install && npm run dev`
- **THEN** one package installs and one dev server starts against a local SQLite file, with no workspace flags, no Docker, and no database service

### Requirement: Automated platform deployment

The application deployment SHALL target Railway with a persistent Volume mounted for the SQLite database (`DATABASE_PATH` env var), running as a single replica with the Recreate deploy strategy (a volume attaches to exactly one container). Database migrations SHALL be applied automatically via the programmatic Drizzle migrator in the server entry, before bootstrap and before the server begins accepting requests.

#### Scenario: Safe database schema updates on deploy

- **WHEN** the app is deployed to production
- **THEN** pending Drizzle migrations are applied against the volume-backed SQLite file before the server starts serving requests

#### Scenario: Deploy replaces the running container

- **WHEN** a new deployment starts
- **THEN** the previous container stops before the new one attaches the volume (brief downtime is accepted; no overlapping access to the SQLite file)

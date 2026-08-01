## ADDED Requirements

### Requirement: Graceful shutdown releases resources in order

On `SIGTERM` or `SIGINT` the server SHALL shut down gracefully: stop accepting new connections (`server.close`), then release stateful resources in a defined order — stop the backup scheduler timer, then close the SQLite connection — and exit with code 0. The handler SHALL be idempotent (a second signal during shutdown is ignored) and bounded by a safety-net timeout (10s) that forces exit 0 if connections or resources do not settle. `server.ts` SHALL be the single owner of shutdown ordering; each stateful module exposes its own stop/close function rather than registering into a shared lifecycle container.

#### Scenario: Normal stop on Railway redeploy

- **WHEN** the platform sends `SIGTERM` during a redeploy
- **THEN** the server stops accepting connections, the backup timer is cleared, the SQLite connection is closed, and the process exits 0 (no "signal SIGTERM" crash in the logs)

#### Scenario: Resources do not settle in time

- **WHEN** in-flight connections or a resource close do not complete within the safety-net window
- **THEN** the safety-net timeout fires and the process still exits 0

#### Scenario: Repeated signal during shutdown

- **WHEN** a second `SIGTERM`/`SIGINT` arrives while shutdown is already in progress
- **THEN** it is ignored and shutdown proceeds once

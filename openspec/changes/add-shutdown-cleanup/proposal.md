## Why

The `SIGTERM`/`SIGINT` handler in `server.ts` closes the HTTP server and exits 0, but leaves two stateful resources dangling: the `better-sqlite3` connection (no WAL checkpoint/flush on exit) and the backup scheduler's `setInterval` timer (never cleared, and it can fire a new backup cycle mid-shutdown). On Railway every redeploy hits this path. We want the process to release its resources in a defined order so a stop is clean, not just quiet.

## What Changes

- Extend `server.ts` `shutdown()` to release resources in order after the HTTP server stops accepting connections: stop the backup scheduler timer, then close the SQLite connection.
- Add `stopBackupScheduler()` to `app/server/backup.ts` and keep the interval handle so the timer can be cleared. Guard `sqlite.close()` against an in-flight backup (the scheduler copies the DB via `sqlite.backup()`), falling back to the existing 10s safety-net exit.
- Keep the single-owner model: `server.ts` orchestrates shutdown; each module exposes its own stop/close function. No shutdown registry/DI abstraction (see design.md for the trade-off).

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `fullstack-architecture`: add a **Graceful shutdown** requirement — on `SIGTERM`/`SIGINT` the server stops accepting connections, releases stateful resources (backup timer, SQLite connection) in order, and exits 0; a safety-net timeout bounds the wait.
- `data-backup`: the scheduler SHALL be stoppable, and its timer SHALL be cleared on server shutdown so no backup cycle starts while the process is exiting.

## Impact

- Code: `server.ts` (shutdown handler), `app/server/backup.ts` (interval handle + `stopBackupScheduler`). `app/server/db.ts` unchanged (`sqlite.close()` already available).
- No schema, migration, dependency, or API changes.
- Deploy behavior: cleaner resource release on Railway redeploys; no change to exit code (still 0 on normal stop).

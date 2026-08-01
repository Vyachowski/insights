## Context

`server.ts` owns the process lifecycle: it builds the Express app, mounts the React Router request handler, calls `app.listen()`, starts the backup scheduler, and installs `SIGTERM`/`SIGINT` handlers. RR7 framework mode gives a request handler, not a server runtime, so signal handling correctly lives here (unlike NestJS, which owns the runtime and offers `enableShutdownHooks()`).

Today `shutdown()` calls `server.close(() => process.exit(0))` plus a 10s safety-net timeout. Two resources are not released:

- `sqlite` (`better-sqlite3`, `app/server/db.ts:12`) — never closed; no explicit WAL checkpoint on exit. The DB file stays consistent (WAL), so this is cleanliness, not corruption risk.
- The backup scheduler's `setInterval` (`app/server/backup.ts:22`) — handle is discarded, so the timer can fire a `runCycle()` mid-shutdown. `runCycle()` snapshots the DB via `sqlite.backup()` (async), which would race a `sqlite.close()`.

## Goals / Non-Goals

**Goals:**
- Release the SQLite connection and stop the backup timer on `SIGTERM`/`SIGINT`, in an order that avoids closing the DB under an in-flight snapshot.
- Keep the change small, explicit, and debuggable; no new abstraction.

**Non-Goals:**
- A general lifecycle/DI container or a `onShutdown()` registry.
- Draining or awaiting in-flight backup uploads (best-effort; safety-net covers it).
- Changing exit codes, health checks, or startup order.

## Decisions

**Single owner, per-module stop functions.** `server.ts` stays the sole orchestrator of shutdown order. Each stateful module exports its own disposer: `stopBackupScheduler()` (new) and `sqlite.close()` (existing). No registry — see trade-off below.

**Ordering.** Inside `shutdown()`:
1. `server.close(...)` — stop accepting new connections (already present).
2. In its callback: `stopBackupScheduler()` — `clearInterval` so no new cycle starts.
3. Then `sqlite.close()`, wrapped in try/catch and logged on failure.
4. `process.exit(0)`.
The existing `setTimeout(10_000).unref()` remains as the safety net.

**In-flight snapshot.** Clearing the interval stops *future* cycles but not one already running. `sqlite.close()` while `sqlite.backup()` is copying will throw; the try/catch logs it and the safety-net timeout still exits 0. Given a daily, seconds-long backup on a solo-dev app, engineering an await/drain is not worth it. Optionally guard with the module's `isBackingUp` flag (skip `close()` when true) — treated as a nice-to-have in tasks, not required.

**`stopBackupScheduler` shape.** Store the interval in a module-level `let timer: NodeJS.Timeout | null`; `stopBackupScheduler()` clears and nulls it; safe to call when storage is unconfigured (timer stays null).

## Risks / Trade-offs

- **No registry.** A `onShutdown(fn)` ledger with LIFO teardown would scale better and mirrors Nest. Rejected now: two resources, and indirection hides the exact order — the one thing that matters here. Revisit if a third stateful resource (e.g. a job queue) appears.
- **Race on close during backup.** Mitigated by try/catch + safety-net; worst case is a logged close error on exit, no data loss (WAL already durable).
- **Testing.** Signal-driven shutdown is awkward to unit-test; cover `stopBackupScheduler()` idempotency directly and verify ordering by reading the handler, rather than spawning a process.

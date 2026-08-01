## 1. Backup scheduler stop function

- [x] 1.1 In `app/server/backup.ts`, store the `setInterval` handle in a module-level `let timer: NodeJS.Timeout | null = null` and assign it in `startBackupScheduler()`.
- [x] 1.2 Add and export `stopBackupScheduler()` that clears the interval and nulls `timer`; safe to call when storage is unconfigured (timer already null).
- [x] 1.3 (Optional) Export the `isBackingUp` state (or a `isBackupInFlight()` getter) so shutdown can skip `sqlite.close()` during an in-flight snapshot.

## 2. Wire cleanup into shutdown

- [x] 2.1 In `server.ts`, import `sqlite` from `./app/server/db` and `stopBackupScheduler` from `./app/server/backup`.
- [x] 2.2 In `shutdown()`, inside the `server.close(...)` callback: call `stopBackupScheduler()`, then `sqlite.close()` wrapped in try/catch (log failures), then `process.exit(0)`. Keep the 10s safety-net timeout.

## 3. Tests & verification

- [x] 3.1 Unit-test `stopBackupScheduler()`: idempotent, no throw when called before start or twice.
- [x] 3.2 `npm run typecheck` and `npm run lint` pass.
- [x] 3.3 Manually verify: start the app, send `SIGTERM`, confirm logs show scheduler stop + DB close and process exits 0.

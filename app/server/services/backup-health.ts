const OVERDUE_MS = 24 * 60 * 60 * 1000

// server.ts runs the scheduler from one copy of this file, but route loaders run
// from the react-router bundle with their own copy, so only a global reaches both
const health = globalThis as { backupFailingSince?: number | null }

export const noteBackupDone = () => { health.backupFailingSince = null }

export const noteBackupFailed = () => { health.backupFailingSince ??= Date.now() }

/** Backups have failed for a day straight, so the admin should be told. */
export const isBackupOverdue = (): boolean =>
  health.backupFailingSince != null && Date.now() - health.backupFailingSince >= OVERDUE_MS

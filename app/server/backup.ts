import fs from 'node:fs'
import path from 'node:path'

import { sqlite } from './db/client'
import { env, isStorageConfigured } from './env'
import { deleteObject, headObject, listObjectKeys, putObject } from './storage'

const HOUR_MS = 60 * 60 * 1000
export const RETENTION_DAYS = 14
const OVERDUE_MS = 24 * HOUR_MS
// Only daily snapshots expire; a hand-made backup under another name stays
const DAILY_KEY = /^backups\/insights-\d{4}-\d{2}-\d{2}\.db$/

let isBackingUp = false
// server.ts runs the scheduler from this file, but route loaders run from the
// react-router bundle with its own copy of it, so only a global reaches both
const health = globalThis as { backupFailingSince?: number | null }
let timer: NodeJS.Timeout | null = null

/** A snapshot is mid-flight; closing the DB now would race `sqlite.backup()`. */
export const isBackupInFlight = (): boolean => isBackingUp

/** Backups have failed for a day straight, so the admin should be told. */
export const isBackupOverdue = (): boolean =>
  health.backupFailingSince != null && Date.now() - health.backupFailingSince >= OVERDUE_MS

const dayKey = (d: Date) => `backups/insights-${d.toISOString().slice(0, 10)}.db`
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * HOUR_MS)

export function startBackupScheduler(): void {
  if (!isStorageConfigured()) {
    console.log('[backup] bucket storage not configured — backups disabled')
    return
  }
  void runCycle()
  timer = setInterval(() => void runCycle(), HOUR_MS)
  console.log(`[backup] scheduler started (hourly check, retention ${RETENTION_DAYS}d)`)
}

/** Clear the hourly timer so no new cycle starts. Idempotent; safe before start. */
export function stopBackupScheduler(): void {
  if (timer) clearInterval(timer)
  timer = null
}

async function runCycle(): Promise<void> {
  if (isBackingUp) return
  isBackingUp = true
  try {
    const todayKey = dayKey(new Date())
    if (!(await headObject(todayKey))) {
      await uploadSnapshot(todayKey)
      // Prune only after a successful upload
      await pruneExpired()
      console.log(`[backup] uploaded ${todayKey}`)
    }
    health.backupFailingSince = null
  } catch (error) {
    health.backupFailingSince ??= Date.now()
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[backup] cycle failed: ${message} (retrying next tick)`)
  } finally {
    isBackingUp = false
  }
}

/** Keys sort by date, so a whole list self-heals strays left by any outage. */
async function pruneExpired(): Promise<void> {
  const lastExpired = dayKey(daysAgo(RETENTION_DAYS))
  const keys = await listObjectKeys('backups/')
  for (const key of keys) {
    if (DAILY_KEY.test(key) && key <= lastExpired) await deleteObject(key)
  }
}

async function uploadSnapshot(key: string): Promise<void> {
  const tempPath = path.join(path.dirname(env.DATABASE_PATH), 'backup.tmp')
  fs.rmSync(tempPath, { force: true })
  try {
    await sqlite.backup(tempPath)
    await putObject(key, fs.readFileSync(tempPath))
  } finally {
    fs.rmSync(tempPath, { force: true })
  }
}

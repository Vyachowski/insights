import fs from 'node:fs'
import path from 'node:path'

import { config, isStorageConfigured } from '../config'
import { sqlite } from '../db/client'
import { noteBackupDone, noteBackupFailed } from '../services/backup-health'
import { deleteObject, headObject, listObjectKeys, putObject } from '../storage'

const HOUR_MS = 60 * 60 * 1000
export const RETENTION_DAYS = 14
// Only daily snapshots expire; a hand-made backup under another name stays
const DAILY_KEY = /^backups\/insights-\d{4}-\d{2}-\d{2}\.db$/

let isBackingUp = false
let timer: NodeJS.Timeout | null = null

/** A snapshot is mid-flight; closing the DB now would race `sqlite.backup()`. */
export const isBackupInFlight = (): boolean => isBackingUp

const dayKey = (d: Date) => `backups/insights-${d.toISOString().slice(0, 10)}.db`
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * HOUR_MS)

export function startBackupScheduler(): void {
  // A local env holds working bucket keys, and a local snapshot would take the day's key
  if (config.NODE_ENV !== 'production') {
    console.log(`[backup] NODE_ENV is ${config.NODE_ENV} — backups off`)
    return
  }
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
    noteBackupDone()
  } catch (error) {
    noteBackupFailed()
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
  const tempPath = path.join(path.dirname(config.DATABASE_PATH), 'backup.tmp')
  fs.rmSync(tempPath, { force: true })
  try {
    await sqlite.backup(tempPath)
    await putObject(key, fs.readFileSync(tempPath))
  } finally {
    fs.rmSync(tempPath, { force: true })
  }
}

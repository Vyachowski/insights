import fs from 'node:fs'
import path from 'node:path'

import { sqlite } from './db'
import { env, isStorageConfigured } from './env'
import { deleteObject, headObject, putObject } from './storage'

const HOUR_MS = 60 * 60 * 1000
export const RETENTION_DAYS = 14

let isBackingUp = false
let timer: NodeJS.Timeout | null = null

/** A snapshot is mid-flight; closing the DB now would race `sqlite.backup()`. */
export const isBackupInFlight = (): boolean => isBackingUp

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
    if (await headObject(todayKey)) return

    await uploadSnapshot(todayKey)
    // Prune only after a successful upload; sliding window self-heals
    // strays from short outages spanning midnight
    for (let n = RETENTION_DAYS; n <= RETENTION_DAYS + 2; n++) {
      await deleteObject(dayKey(daysAgo(n)))
    }
    console.log(`[backup] uploaded ${todayKey}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[backup] cycle failed: ${message} (retrying next tick)`)
  } finally {
    isBackingUp = false
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

import fs from 'node:fs'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// backup.ts pulls in the real DB/env/storage on import; stub them so the module
// loads without opening SQLite or validating env.
const storage = vi.hoisted(() => ({
  configured: false,
  deleteObject: vi.fn(),
  headObject: vi.fn(),
  listObjectKeys: vi.fn(),
  putObject: vi.fn(),
}))

vi.mock('./db/client', () => ({
  sqlite: {
    backup: vi.fn(async (target: string) => fs.writeFileSync(target, 'snapshot')),
  },
}))
vi.mock('./env', () => ({
  env: { DATABASE_PATH: '/tmp/test.db' },
  isStorageConfigured: () => storage.configured,
}))
vi.mock('./storage', () => storage)

describe('stopBackupScheduler', () => {
  it('is safe to call before the scheduler starts', async () => {
    const { stopBackupScheduler } = await import('./backup')
    expect(() => stopBackupScheduler()).not.toThrow()
  })

  it('is idempotent when called twice', async () => {
    const { startBackupScheduler, stopBackupScheduler } = await import('./backup')
    startBackupScheduler() // storage unconfigured → no timer set, logs "disabled"
    expect(() => {
      stopBackupScheduler()
      stopBackupScheduler()
    }).not.toThrow()
  })
})

describe('backup cycle', () => {
  const NOW = new Date('2026-10-30T12:00:00Z')
  const HOUR_MS = 60 * 60 * 1000

  beforeEach(() => {
    vi.resetModules()
    delete (globalThis as { backupFailingSince?: number | null }).backupFailingSince
    vi.useFakeTimers({ now: NOW, toFake: ['Date', 'setInterval', 'clearInterval'] })
    vi.clearAllMocks()
    storage.configured = true
    storage.headObject.mockResolvedValue(false)
    storage.listObjectKeys.mockResolvedValue([])
    storage.putObject.mockResolvedValue(undefined)
    storage.deleteObject.mockResolvedValue(undefined)
  })

  afterEach(async () => {
    const { stopBackupScheduler } = await import('./backup')
    stopBackupScheduler()
    vi.useRealTimers()
    vi.restoreAllMocks()
    storage.configured = false
  })

  async function runCycle() {
    const { startBackupScheduler } = await import('./backup')
    const logged = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const failed = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    startBackupScheduler()
    await vi.waitFor(() => {
      const done = logged.mock.calls.some(([line]) => String(line).startsWith('[backup] uploaded'))
      expect(done || failed.mock.calls.length > 0).toBe(true)
    })
  }

  it('prunes every daily backup past retention, however old', async () => {
    storage.listObjectKeys.mockResolvedValue([
      'backups/insights-2026-10-08.db',
      'backups/insights-2026-10-16.db',
      'backups/insights-2026-10-17.db',
      'backups/insights-2026-10-30.db',
    ])
    await runCycle()

    await vi.waitFor(() => expect(storage.deleteObject).toHaveBeenCalledTimes(2))
    expect(storage.deleteObject.mock.calls.flat()).toEqual([
      'backups/insights-2026-10-08.db',
      'backups/insights-2026-10-16.db',
    ])
  })

  it('never prunes a backup outside the daily naming', async () => {
    storage.listObjectKeys.mockResolvedValue([
      'backups/pre-0003-2026-01-01T00-00-00-000Z.db',
      'backups/insights-notes.db',
    ])
    await runCycle()
    await vi.waitFor(() => expect(storage.listObjectKeys).toHaveBeenCalled())

    expect(storage.deleteObject).not.toHaveBeenCalled()
  })

  it('prunes nothing when the upload fails', async () => {
    storage.putObject.mockRejectedValue(new Error('S3 PUT: 403'))
    await runCycle()

    expect(storage.listObjectKeys).not.toHaveBeenCalled()
    expect(storage.deleteObject).not.toHaveBeenCalled()
  })

  it('reports overdue after a day of failures, not before', async () => {
    storage.headObject.mockRejectedValue(new Error('S3 HEAD: 403'))
    await runCycle()

    const { isBackupOverdue } = await import('./backup')
    expect(isBackupOverdue()).toBe(false)
    // waitFor moves the fake clock a little, so the failure sits just after NOW
    vi.setSystemTime(NOW.getTime() + 25 * HOUR_MS)
    expect(isBackupOverdue()).toBe(true)
  })

  it('clears overdue after the next good cycle', async () => {
    storage.headObject.mockRejectedValueOnce(new Error('S3 HEAD: 403'))
    await runCycle()

    vi.setSystemTime(NOW.getTime() + 24 * HOUR_MS)
    storage.headObject.mockResolvedValue(true)
    await vi.advanceTimersByTimeAsync(HOUR_MS)

    const { isBackupOverdue } = await import('./backup')
    await vi.waitFor(() => expect(isBackupOverdue()).toBe(false))
  })
})

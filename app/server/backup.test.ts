import { describe, expect, it, vi } from 'vitest'

// backup.ts pulls in the real DB/env/storage on import; stub them so the module
// loads without opening SQLite or validating env.
vi.mock('./db', () => ({ sqlite: { backup: vi.fn() } }))
vi.mock('./env', () => ({
  env: { DATABASE_PATH: '/tmp/test.db' },
  isStorageConfigured: () => false,
}))
vi.mock('./storage', () => ({
  deleteObject: vi.fn(),
  headObject: vi.fn(),
  putObject: vi.fn(),
}))

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

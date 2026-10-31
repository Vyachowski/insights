import { vi } from 'vitest'

// Every test runs on a real in-memory SQLite built from the committed migrations
vi.mock('@/server/db/client', async () => {
  const { default: Database } = await import('better-sqlite3')
  const { drizzle } = await import('drizzle-orm/better-sqlite3')
  const schema = await import('@/server/db/schema')
  const { applyMigrations } = await import('@/server/db/test-migrations')

  const sqlite = new Database(':memory:')
  applyMigrations(sqlite)
  return { sqlite, db: drizzle(sqlite, { schema }) }
})

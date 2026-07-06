import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import { db, enableForeignKeys } from './db'

export function runMigrations(): void {
  migrate(db, { migrationsFolder: 'drizzle' })
  enableForeignKeys()
  console.log('[migrate] migrations up to date')
}

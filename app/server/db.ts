import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import { env } from './env'
import * as schema from './schema'

fs.mkdirSync(path.dirname(env.DATABASE_PATH), { recursive: true })

export const sqlite = new Database(env.DATABASE_PATH)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('busy_timeout = 5000')

export const db = drizzle(sqlite, { schema })

// Called after migrate() — drizzle-kit recreates tables via temp-copy-drop,
// which active FK constraints would break
export function enableForeignKeys(): void {
  sqlite.pragma('foreign_keys = ON')
}

export function pingDb(): void {
  sqlite.prepare('SELECT 1').get()
}

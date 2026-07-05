import { migrate } from 'drizzle-orm/node-postgres/migrator'

import { db } from './db'
import { pingDb } from './db-ping'
import { env } from './env'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function migrateWithRetry(): Promise<void> {
  const { DATABASE_CONNECT_RETRIES: retries, DATABASE_CONNECT_DELAY: delay } =
    env

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pingDb()
      break
    } catch (error) {
      if (attempt === retries) throw error
      console.warn(
        `[migrate] DB not reachable (attempt ${attempt}/${retries}), retrying in ${delay}ms`,
      )
      await sleep(delay)
    }
  }

  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('[migrate] migrations up to date')
}

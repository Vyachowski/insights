import { Pool } from 'pg'

import { env } from './env'

// Standalone minimal pool for health checks; the app's Drizzle client
// lives in db.ts (data-layer task) and will reuse this pool.
export const pool = new Pool({ connectionString: env.DATABASE_URL, max: 5 })

export async function pingDb(): Promise<void> {
  await pool.query('SELECT 1')
}

import { bootstrap } from './bootstrap'
import { migrateWithRetry } from './migrate'

// Startup sequence: migrate → bootstrap. Called once from server.ts
// before the HTTP server starts listening.
export async function runStartup(): Promise<void> {
  await migrateWithRetry()
  await bootstrap()
}

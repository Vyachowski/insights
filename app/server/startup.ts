import { bootstrap } from './bootstrap'
import { runMigrations } from './migrate'

// Startup sequence: migrate → enable FKs → bootstrap. Called once from
// server.ts before the HTTP server starts listening.
export async function runStartup(): Promise<void> {
  runMigrations()
  await bootstrap()
}

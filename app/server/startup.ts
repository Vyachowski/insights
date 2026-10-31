import { runMigrations } from './db/migrate'
import { bootstrap } from './services/bootstrap'

// Startup sequence: migrate → enable FKs → bootstrap. Called once from
// server.ts before the HTTP server starts listening.
export async function runStartup(): Promise<void> {
  runMigrations()
  await bootstrap()
}

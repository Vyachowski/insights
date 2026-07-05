// Startup sequence: migrate → bootstrap. Called once from server.ts
// before the HTTP server starts listening.
export async function runStartup(): Promise<void> {
  // Wired by data-layer tasks: migrateWithRetry(), then bootstrap().
}

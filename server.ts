import 'dotenv/config'

import { createRequestHandler } from '@react-router/express'
import express from 'express'

// Validates env on import — fail fast before anything else
const { env } = await import('./app/server/env')

// Startup order (design decision 7): env → migrate → bootstrap → listen.
// migrate/bootstrap are wired by the data-layer tasks; placeholders keep
// the sequence explicit.
const { runStartup } = await import('./app/server/startup')
await runStartup()

const isProduction = env.NODE_ENV === 'production'

const viteDevServer = isProduction
  ? undefined
  : await import('vite').then(vite =>
    vite.createServer({ server: { middlewareMode: true } }),
  )

const app = express()
app.disable('x-powered-by')

if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
  )
  app.use(express.static('build/client', { maxAge: '1h' }))
}

app.use(
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
      : // @ts-expect-error build output exists only after `react-router build`
      await import('./build/server/index.js'),
  }),
)

const server = app.listen(env.PORT, () => {
  console.log(`[web] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`)
})

const { startBackupScheduler, stopBackupScheduler, isBackupInFlight } = await import(
  './app/server/backup'
)
startBackupScheduler()

const { sqlite } = await import('./app/server/db')

// Graceful shutdown: Railway sends SIGTERM on every redeploy/stop. Close the
// HTTP server and exit 0 so a normal stop doesn't surface as an "npm error
// signal SIGTERM" (a non-zero exit that reads like a crash in the logs).
let shuttingDown = false
function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[web] ${signal} received, shutting down`)
  server.close(() => {
    // Release stateful resources in order: stop the backup timer so no new
    // cycle starts, then close the DB. Skip close() if a snapshot is still
    // copying (it uses the same connection) — the safety net below covers it.
    stopBackupScheduler()
    if (!isBackupInFlight()) {
      try {
        sqlite.close()
      } catch (err) {
        console.error('[web] sqlite.close() failed:', err)
      }
    }
    process.exit(0)
  })
  // Safety net if connections don't drain in time.
  setTimeout(() => process.exit(0), 10_000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// Leave a clear trace if a real crash ever happens (instead of silent death).
process.on('uncaughtException', err => {
  console.error('[web] uncaughtException:', err)
  process.exit(1)
})
process.on('unhandledRejection', reason => {
  console.error('[web] unhandledRejection:', reason)
})

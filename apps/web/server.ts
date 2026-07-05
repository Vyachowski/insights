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

app.all(
  '*',
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
      : // @ts-expect-error build output exists only after `react-router build`
      await import('./build/server/index.js'),
  }),
)

app.listen(env.PORT, () => {
  console.log(`[web] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`)
})

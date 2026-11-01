import { pingDb } from '@/server/db/client'
import { env } from '@/server/env'

export async function loader() {
  const version = env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) || 'dev'
  try {
    pingDb()
    return Response.json({ status: 'ok', db: 'up', version })
  } catch {
    return Response.json({ status: 'degraded', db: 'down', version }, { status: 503 })
  }
}

import { pingDb } from '@/server/db'

export async function loader() {
  try {
    pingDb()
    return Response.json({ status: 'ok', db: 'up' })
  } catch {
    return Response.json({ status: 'degraded', db: 'down' }, { status: 503 })
  }
}

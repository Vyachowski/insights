import { pingDb } from '@/server/db-ping'

export async function loader() {
  try {
    await pingDb()
    return Response.json({ status: 'ok', db: 'up' })
  } catch {
    return Response.json({ status: 'degraded', db: 'down' }, { status: 503 })
  }
}

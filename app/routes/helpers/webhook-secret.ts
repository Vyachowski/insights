import { env } from '@/server/env'

export function assertWebhookSecret(secret: string | undefined): void {
  const expected = env.GUDOK_WEBHOOK_SECRET
  // 404 (not 401) on mismatch/unset so the endpoint's existence isn't confirmed
  if (!expected || secret !== expected) {
    throw new Response('Not Found', { status: 404 })
  }
}

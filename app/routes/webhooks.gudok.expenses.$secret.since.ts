import type { Route } from './+types/webhooks.gudok.expenses.$secret.since'

import { env } from '@/server/env'
import { latestTelephonyDate } from '@/server/expenses/gudok-history'

// Companion to the telephony ingest endpoint: tells the bookmarklet the latest
// day already stored so it only expands Gudok's date range back to there.
const GUDOK_ORIGIN = 'https://in.gudok.tel'

function assertSecret(secret: string | undefined): void {
  const expected = env.GUDOK_WEBHOOK_SECRET
  if (!expected || secret !== expected) {
    throw new Response('Not Found', { status: 404 })
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  assertSecret(params.secret)
  const since = await latestTelephonyDate()
  return Response.json(
    { since },
    { headers: { 'Access-Control-Allow-Origin': GUDOK_ORIGIN, 'Vary': 'Origin' } },
  )
}

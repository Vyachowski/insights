import type { Route } from './+types/webhooks.gudok.expenses.$secret.since'

import { latestTelephonyDate } from '@/server/services/gudok-expenses'
import { assertWebhookSecret } from '@/server/webhook-secret'

// Companion to the telephony ingest endpoint: tells the bookmarklet the latest
// day already stored so it only expands Gudok's date range back to there.
const GUDOK_ORIGIN = 'https://in.gudok.tel'

export async function loader({ params }: Route.LoaderArgs) {
  assertWebhookSecret(params.secret)
  const since = await latestTelephonyDate()
  return Response.json(
    { since },
    { headers: { 'Access-Control-Allow-Origin': GUDOK_ORIGIN, 'Vary': 'Origin' } },
  )
}

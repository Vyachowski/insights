import type { Route } from './+types/webhooks.gudok.expenses.$secret.since'

import { withGudokCors } from '@/routes/helpers/gudok-cors'
import { assertWebhookSecret } from '@/routes/helpers/webhook-secret'
import { latestTelephonyDate } from '@/server/services/gudok-expenses'

// Companion to the telephony ingest endpoint: tells the bookmarklet the latest
// day already stored so it only expands Gudok's date range back to there.
export function loader({ params }: Route.LoaderArgs) {
  return withGudokCors(async () => {
    assertWebhookSecret(params.secret)
    return Response.json({ since: await latestTelephonyDate() })
  })
}

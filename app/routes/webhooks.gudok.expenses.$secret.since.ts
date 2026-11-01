import type { Route } from './+types/webhooks.gudok.expenses.$secret.since'

import { withGudokCors } from '@/routes/helpers/gudok-cors'
import { assertWebhookSecret } from '@/routes/helpers/webhook-secret'
import { telephonySince } from '@/server/services/gudok-expenses'

// Companion to the telephony endpoint: tells the bookmarklet the day it must
// reach, so it only expands Gudok's date range back to there.
export function loader({ params }: Route.LoaderArgs) {
  return withGudokCors(async () => {
    assertWebhookSecret(params.secret)
    return Response.json({ since: telephonySince() })
  })
}

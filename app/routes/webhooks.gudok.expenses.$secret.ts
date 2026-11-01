import type { Route } from './+types/webhooks.gudok.expenses.$secret'

import { withGudokCors } from '@/routes/helpers/gudok-cors'
import { assertWebhookSecret } from '@/routes/helpers/webhook-secret'
import { GudokPayloadError, receiveGudokReply } from '@/server/services/reconciliation'

async function readBody(request: Request): Promise<unknown> {
  try {
    return JSON.parse(await request.text())
  } catch {
    throw new GudokPayloadError('Malformed request body')
  }
}

// Secret-gated endpoint for Gudok /history charges, posted by the console script
// running on https://in.gudok.tel: Gudok's /history.json reply as it is. The
// script posts a JSON string with a `text/plain` content-type so the browser
// treats it as a "simple" request and skips the CORS preflight; the CORS headers
// let the script read the result. Shares the call-webhook secret.
export function action({ request, params }: Route.ActionArgs) {
  return withGudokCors(async () => {
    assertWebhookSecret(params.secret)
    try {
      return Response.json({ ok: true, ...await receiveGudokReply(await readBody(request)) })
    } catch (error) {
      if (error instanceof GudokPayloadError) {
        return Response.json({ error: error.message }, { status: 400 })
      }
      throw error
    }
  })
}

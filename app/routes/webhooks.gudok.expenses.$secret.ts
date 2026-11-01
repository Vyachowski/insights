import type { Route } from './+types/webhooks.gudok.expenses.$secret'
import type { GudokOperationRow } from '@/server/services/gudok-expenses'

import { withGudokCors } from '@/routes/helpers/gudok-cors'
import { assertWebhookSecret } from '@/routes/helpers/webhook-secret'
import { GudokPayloadError, receiveGudokPost, receiveGudokReply } from '@/server/services/reconciliation'

async function readBody(request: Request) {
  try {
    return JSON.parse(await request.text()) as { operations?: unknown, period?: unknown } | null
  } catch {
    throw new GudokPayloadError('Malformed request body')
  }
}

// Secret-gated endpoint for Gudok /history charges, posted by the console script
// running on https://in.gudok.tel: Gudok's /history.json reply as it is, or the
// older `operations` list. The console script posts a JSON string with a
// `text/plain` content-type so the browser treats it as a "simple" request and
// skips the CORS preflight; the CORS headers let the console script read the
// result. Shares the call-webhook secret.
export function action({ request, params }: Route.ActionArgs) {
  return withGudokCors(async () => {
    assertWebhookSecret(params.secret)
    try {
      const body = await readBody(request)
      const result = Array.isArray(body?.operations)
        ? await receiveGudokPost(body.operations as GudokOperationRow[], body.period)
        : await receiveGudokReply(body)
      return Response.json({ ok: true, ...result })
    } catch (error) {
      if (error instanceof GudokPayloadError) {
        return Response.json({ error: error.message }, { status: 400 })
      }
      throw error
    }
  })
}

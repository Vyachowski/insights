import type { Route } from './+types/webhooks.gudok.expenses.$secret'
import type { GudokOperationRow } from '@/server/services/gudok-expenses'

import { withGudokCors } from '@/routes/helpers/gudok-cors'
import { assertWebhookSecret } from '@/routes/helpers/webhook-secret'
import { GudokPayloadError, receiveGudokPost } from '@/server/services/reconciliation'

async function readPost(request: Request) {
  try {
    const body = JSON.parse(await request.text()) as { operations?: unknown, period?: unknown } | null
    if (!Array.isArray(body?.operations)) throw new Error('missing operations[]')
    return { rows: body.operations as GudokOperationRow[], period: body.period }
  } catch {
    throw new GudokPayloadError('Malformed request body')
  }
}

// Secret-gated endpoint for Gudok /history charges, posted by the bookmarklet
// running on https://in.gudok.tel. The bookmarklet posts a JSON string with a
// `text/plain` content-type so the browser treats it as a "simple" request and
// skips the CORS preflight; the CORS headers let the bookmarklet read the
// result. Shares the call-webhook secret.
export function action({ request, params }: Route.ActionArgs) {
  return withGudokCors(async () => {
    assertWebhookSecret(params.secret)
    try {
      const { rows, period } = await readPost(request)
      return Response.json({ ok: true, ...await receiveGudokPost(rows, period) })
    } catch (error) {
      if (error instanceof GudokPayloadError) {
        return Response.json({ error: error.message }, { status: 400 })
      }
      throw error
    }
  })
}

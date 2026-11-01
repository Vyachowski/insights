import type { Route } from './+types/webhooks.gudok.expenses.$secret'

import { withGudokCors } from '@/routes/helpers/gudok-cors'
import { assertWebhookSecret } from '@/routes/helpers/webhook-secret'
import { ingestGudokExpenses, type GudokOperationRow } from '@/server/services/gudok-expenses'

// Secret-gated ingest for Gudok /history charges, posted by the bookmarklet
// running on https://in.gudok.tel. The bookmarklet posts a JSON string with a
// `text/plain` content-type so the browser treats it as a "simple" request and
// skips the CORS preflight; the CORS headers let the bookmarklet read the
// result. Shares the call-webhook secret.
export function action({ request, params }: Route.ActionArgs) {
  return withGudokCors(async () => {
    assertWebhookSecret(params.secret)

    let rows: GudokOperationRow[]
    try {
      const text = await request.text()
      const body: unknown = JSON.parse(text)
      const ops = (body as { operations?: unknown })?.operations
      if (!Array.isArray(ops)) throw new Error('missing operations[]')
      rows = ops as GudokOperationRow[]
    } catch {
      return Response.json({ error: 'Malformed request body' }, { status: 400 })
    }

    const result = await ingestGudokExpenses(rows)
    return Response.json({ ok: true, ...result })
  })
}

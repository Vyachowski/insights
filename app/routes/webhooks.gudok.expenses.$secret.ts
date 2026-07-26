import type { Route } from './+types/webhooks.gudok.expenses.$secret'

import { env } from '@/server/env'
import { ingestGudokExpenses, type GudokOperationRow } from '@/server/expenses/gudok-history'

// Secret-gated ingest for Gudok /history charges, posted by the bookmarklet
// running on https://in.gudok.tel. The bookmarklet posts a JSON string with a
// `text/plain` content-type so the browser treats it as a "simple" request and
// skips the CORS preflight; we still send Access-Control-Allow-Origin so the
// bookmarklet can read the result. Shares the call-webhook secret.
const GUDOK_ORIGIN = 'https://in.gudok.tel'

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': GUDOK_ORIGIN,
    'Vary': 'Origin',
  }
}

function assertSecret(secret: string | undefined): void {
  const expected = env.GUDOK_WEBHOOK_SECRET
  if (!expected || secret !== expected) {
    throw new Response('Not Found', { status: 404 })
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  assertSecret(params.secret)

  let rows: GudokOperationRow[]
  try {
    const text = await request.text()
    const body: unknown = JSON.parse(text)
    const ops = (body as { operations?: unknown })?.operations
    if (!Array.isArray(ops)) throw new Error('missing operations[]')
    rows = ops as GudokOperationRow[]
  } catch {
    return Response.json({ error: 'Malformed request body' }, { status: 400, headers: corsHeaders() })
  }

  const result = await ingestGudokExpenses(rows)
  return Response.json({ ok: true, ...result }, { headers: corsHeaders() })
}

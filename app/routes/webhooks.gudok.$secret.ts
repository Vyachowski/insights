import type { Route } from './+types/webhooks.gudok.$secret'

import { assertWebhookSecret } from '@/routes/helpers/webhook-secret'
import { GudokPayloadError, ingestGudokCall } from '@/server/services/gudok-calls'

// Public, secret-gated webhook for Gudok call-completion events. Gudok's config
// exposes only a destination URL and a GET/POST toggle (no headers/auth), so the
// shared secret travels in the URL path and both methods are accepted.

async function readParams(request: Request): Promise<Record<string, unknown>> {
  if (request.method === 'GET') {
    return Object.fromEntries(new URL(request.url).searchParams)
  }
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return (await request.json()) as Record<string, unknown>
  }
  return Object.fromEntries(await request.formData())
}

async function handle(request: Request, secret: string | undefined) {
  assertWebhookSecret(secret)
  let params: Record<string, unknown>
  try {
    params = await readParams(request)
  } catch {
    return Response.json({ error: 'Malformed request body' }, { status: 400 })
  }
  try {
    const result = await ingestGudokCall(params)
    return Response.json({ ok: true, ...result })
  } catch (error) {
    if (error instanceof GudokPayloadError) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}

// POST: fields in the request body (JSON or form-encoded)
export async function action({ request, params }: Route.ActionArgs) {
  return handle(request, params.secret)
}

// GET: fields in the query string
export async function loader({ request, params }: Route.LoaderArgs) {
  return handle(request, params.secret)
}

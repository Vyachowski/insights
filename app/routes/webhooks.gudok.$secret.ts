import type { Route } from './+types/webhooks.gudok.$secret'

import { GudokPayloadError, ingestGudokCall } from '@/server/calls/gudok-webhook'
import { env } from '@/server/env'

// Public, secret-gated webhook for Gudok call-completion events. Gudok's config
// exposes only a destination URL and a GET/POST toggle (no headers/auth), so the
// shared secret travels in the URL path and both methods are accepted.

function assertSecret(secret: string | undefined): void {
  const expected = env.GUDOK_WEBHOOK_SECRET
  // 404 (not 401) on mismatch/unset so the endpoint's existence isn't confirmed
  if (!expected || secret !== expected) {
    throw new Response('Not Found', { status: 404 })
  }
}

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
  assertSecret(secret)
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

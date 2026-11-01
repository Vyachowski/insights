// The bookmarklet runs on this origin, so the browser hides a reply without these headers.
const GUDOK_ORIGIN = 'https://in.gudok.tel'

function toResponse(thrown: unknown) {
  if (thrown instanceof Response) return thrown
  console.error(thrown)
  return Response.json({ error: 'Internal server error' }, { status: 500 })
}

/** Runs a bookmarklet route so every reply is readable, the thrown 404 and a failure too. */
export async function withGudokCors(handler: () => Promise<Response>) {
  const response = await handler().catch(toResponse)
  response.headers.set('Access-Control-Allow-Origin', GUDOK_ORIGIN)
  response.headers.set('Vary', 'Origin')
  return response
}

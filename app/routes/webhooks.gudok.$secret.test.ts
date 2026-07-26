import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockEnv: { GUDOK_WEBHOOK_SECRET?: string } = {}
const ingestMock = vi.fn()

vi.mock('@/server/env', () => ({ env: mockEnv }))
vi.mock('@/server/calls/gudok-webhook', async () => {
  class GudokPayloadError extends Error {}
  return { GudokPayloadError, ingestGudokCall: (p: unknown) => ingestMock(p) }
})

const { action, loader } = await import('./webhooks.gudok.$secret')
const { GudokPayloadError } = await import('@/server/calls/gudok-webhook')

const SECRET = 'top-secret'
// The handlers only touch request + params.secret; cast past the fuller
// generated Route arg types, which aren't relevant to this test.
type Handler = (a: { request: Request; params: { secret: string } }) => Promise<Response>
const call = (fn: unknown, request: Request, secret: string) =>
  (fn as Handler)({ request, params: { secret } })

beforeEach(() => {
  mockEnv.GUDOK_WEBHOOK_SECRET = SECRET
  ingestMock.mockReset()
  ingestMock.mockResolvedValue({ stored: true, duplicate: false, gudokId: 1, siteId: 5 })
})

describe('gudok webhook route', () => {
  it('POST with valid secret and JSON body → 200 and ingests parsed body', async () => {
    const body = { id: 1, date: '2026-07-26T10:00:00Z' }
    const req = new Request('http://x/webhooks/gudok/top-secret', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const res = await call(action, req, SECRET)
    expect(res.status).toBe(200)
    expect(ingestMock).toHaveBeenCalledWith(body)
  })

  it('GET with valid secret reads query params', async () => {
    const req = new Request('http://x/webhooks/gudok/top-secret?id=9&date=2026-01-01')
    const res = await call(loader, req, SECRET)
    expect(res.status).toBe(200)
    expect(ingestMock).toHaveBeenCalledWith({ id: '9', date: '2026-01-01' })
  })

  it('wrong secret → 404, no ingest', async () => {
    const req = new Request('http://x/webhooks/gudok/nope', { method: 'POST' })
    await expect(call(action, req, 'nope')).rejects.toMatchObject({ status: 404 })
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('secret unset → 404', async () => {
    mockEnv.GUDOK_WEBHOOK_SECRET = undefined
    const req = new Request('http://x/webhooks/gudok/top-secret', { method: 'POST' })
    await expect(call(action, req, SECRET)).rejects.toMatchObject({ status: 404 })
  })

  it('malformed payload → 400', async () => {
    ingestMock.mockRejectedValue(new GudokPayloadError('bad'))
    const req = new Request('http://x/webhooks/gudok/top-secret', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nope: true }),
    })
    const res = await call(action, req, SECRET)
    expect(res.status).toBe(400)
  })

  it('duplicate delivery still → 200', async () => {
    ingestMock.mockResolvedValue({ stored: false, duplicate: true, gudokId: 1, siteId: 5 })
    const req = new Request('http://x/webhooks/gudok/top-secret', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 1, date: '2026-07-26T10:00:00Z' }),
    })
    const res = await call(action, req, SECRET)
    expect(res.status).toBe(200)
  })
})

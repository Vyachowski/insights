import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockEnv: { GUDOK_WEBHOOK_SECRET?: string } = {}
const receiveMock = vi.fn()

vi.mock('@/server/env', () => ({ env: mockEnv }))
vi.mock('@/server/services/reconciliation', () => {
  class GudokPayloadError extends Error {}
  return { GudokPayloadError, receiveGudokPost: (rows: unknown, period: unknown) => receiveMock(rows, period) }
})

const { action } = await import('./webhooks.gudok.expenses.$secret')
const { GudokPayloadError } = await import('@/server/services/reconciliation')

const SECRET = 'top-secret'
const OPERATIONS = [{ id: 1 }]
const PERIOD = { start: '2026-10-01', end: '2026-10-31' }
// The handler only touches request + params.secret; cast past the fuller
// generated Route arg types, which aren't relevant to this test.
type Handler = (a: { request: Request; params: { secret?: string } }) => Promise<Response>
const call = (secret?: string, body = JSON.stringify({ operations: OPERATIONS })) =>
  (action as unknown as Handler)({
    request: new Request('http://x/webhooks/gudok/expenses', { method: 'POST', body }),
    params: { secret },
  })
const expectReadable = (res: Response) =>
  expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://in.gudok.tel')

beforeEach(() => {
  mockEnv.GUDOK_WEBHOOK_SECRET = SECRET
  receiveMock.mockReset()
  receiveMock.mockResolvedValue({ created: 1 })
})

describe('gudok expenses webhook route', () => {
  it('valid secret, no period → 200 and passes the operations on', async () => {
    const res = await call(SECRET)
    expect(res.status).toBe(200)
    expectReadable(res)
    expect(receiveMock).toHaveBeenCalledWith(OPERATIONS, undefined)
  })

  it('period → passes it on and returns the counts', async () => {
    receiveMock.mockResolvedValue({ created: 2, updated: 0, skipped: 1, deletedEstimates: 3 })
    const res = await call(SECRET, JSON.stringify({ operations: [], period: PERIOD }))
    expect(res.status).toBe(200)
    expect(receiveMock).toHaveBeenCalledWith([], PERIOD)
    expect(await res.json()).toEqual({ ok: true, created: 2, updated: 0, skipped: 1, deletedEstimates: 3 })
  })

  it('refused post → readable 400 with the reason', async () => {
    receiveMock.mockRejectedValue(new GudokPayloadError('Invalid period date'))
    const res = await call(SECRET, JSON.stringify({ operations: [], period: { start: 'x' } }))
    expect(res.status).toBe(400)
    expectReadable(res)
    expect(await res.json()).toEqual({ error: 'Invalid period date' })
  })

  it.each(['nope', undefined])('secret %j → readable 404, nothing received', async secret => {
    const res = await call(secret)
    expect(res.status).toBe(404)
    expectReadable(res)
    expect(receiveMock).not.toHaveBeenCalled()
  })

  it('secret unset → 404, nothing received', async () => {
    mockEnv.GUDOK_WEBHOOK_SECRET = undefined
    expect((await call(SECRET)).status).toBe(404)
    expect(receiveMock).not.toHaveBeenCalled()
  })

  it.each(['not json', 'null', '{}', '{"operations":"x"}'])('body %s → readable 400, nothing received', async body => {
    const res = await call(SECRET, body)
    expect(res.status).toBe(400)
    expectReadable(res)
    expect(receiveMock).not.toHaveBeenCalled()
  })

  it('failed write → readable 500', async () => {
    vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    receiveMock.mockRejectedValue(new Error('disk'))
    const res = await call(SECRET)
    expect(res.status).toBe(500)
    expectReadable(res)
    expect(await res.json()).toEqual({ error: 'Internal server error' })
  })
})

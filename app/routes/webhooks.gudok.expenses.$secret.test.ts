import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockEnv: { GUDOK_WEBHOOK_SECRET?: string } = {}
const ingestMock = vi.fn()

vi.mock('@/server/env', () => ({ env: mockEnv }))
vi.mock('@/server/services/gudok-expenses', () => ({
  ingestGudokExpenses: (rows: unknown) => ingestMock(rows),
}))

const { action } = await import('./webhooks.gudok.expenses.$secret')

const SECRET = 'top-secret'
const OPERATIONS = [{ id: 1 }]
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
  ingestMock.mockReset()
  ingestMock.mockResolvedValue({ stored: 1 })
})

describe('gudok expenses webhook route', () => {
  it('valid secret → 200 and ingests the operations', async () => {
    const res = await call(SECRET)
    expect(res.status).toBe(200)
    expectReadable(res)
    expect(ingestMock).toHaveBeenCalledWith(OPERATIONS)
  })

  it.each(['nope', undefined])('secret %j → readable 404, no ingest', async secret => {
    const res = await call(secret)
    expect(res.status).toBe(404)
    expectReadable(res)
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('secret unset → 404, no ingest', async () => {
    mockEnv.GUDOK_WEBHOOK_SECRET = undefined
    expect((await call(SECRET)).status).toBe(404)
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it.each(['not json', 'null', '{}', '{"operations":"x"}'])('body %s → readable 400, no ingest', async body => {
    const res = await call(SECRET, body)
    expect(res.status).toBe(400)
    expectReadable(res)
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('failed write → readable 500', async () => {
    vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    ingestMock.mockRejectedValue(new Error('disk'))
    const res = await call(SECRET)
    expect(res.status).toBe(500)
    expectReadable(res)
    expect(await res.json()).toEqual({ error: 'Internal server error' })
  })
})

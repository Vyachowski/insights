import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockConfig: { GUDOK_WEBHOOK_SECRET?: string } = {}
const receiveMock = vi.fn()
const replyMock = vi.fn()

vi.mock('@/server/config', () => ({ config: mockConfig }))
vi.mock('@/server/services/reconciliation', () => {
  class GudokPayloadError extends Error {}
  return {
    GudokPayloadError,
    receiveGudokPost: (rows: unknown, period: unknown) => receiveMock(rows, period),
    receiveGudokReply: (reply: unknown) => replyMock(reply),
  }
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
  mockConfig.GUDOK_WEBHOOK_SECRET = SECRET
  receiveMock.mockReset()
  receiveMock.mockResolvedValue({ created: 1 })
  replyMock.mockReset()
  replyMock.mockResolvedValue({ created: 2 })
})

describe('gudok expenses webhook route', () => {
  it('valid secret, no period → 200 and passes the operations on', async () => {
    const res = await call(SECRET)
    expect(res.status).toBe(200)
    expectReadable(res)
    expect(receiveMock).toHaveBeenCalledWith(OPERATIONS, undefined)
  })

  it('Gudok reply → passes it on whole and returns the counts', async () => {
    const reply = { recordsFiltered: 1, data: [{ DT_RowId: '1' }] }
    const res = await call(SECRET, JSON.stringify(reply))
    expect(res.status).toBe(200)
    expectReadable(res)
    expect(replyMock).toHaveBeenCalledWith(reply)
    expect(receiveMock).not.toHaveBeenCalled()
    expect(await res.json()).toEqual({ ok: true, created: 2 })
  })

  it('refused reply → readable 400 with the reason', async () => {
    replyMock.mockRejectedValue(new GudokPayloadError('Гудок изменился: в ответе нет строк. Ничего не записано'))
    const res = await call(SECRET, '{}')
    expect(res.status).toBe(400)
    expectReadable(res)
    expect(await res.json()).toEqual({ error: 'Гудок изменился: в ответе нет строк. Ничего не записано' })
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
    mockConfig.GUDOK_WEBHOOK_SECRET = undefined
    expect((await call(SECRET)).status).toBe(404)
    expect(receiveMock).not.toHaveBeenCalled()
  })

  it('broken JSON → readable 400, nothing received', async () => {
    const res = await call(SECRET, 'not json')
    expect(res.status).toBe(400)
    expectReadable(res)
    expect(receiveMock).not.toHaveBeenCalled()
    expect(replyMock).not.toHaveBeenCalled()
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

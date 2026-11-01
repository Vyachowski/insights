import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockConfig: { GUDOK_WEBHOOK_SECRET?: string } = {}
const replyMock = vi.fn()

vi.mock('@/server/config', () => ({ config: mockConfig }))
vi.mock('@/server/services/reconciliation', () => {
  class GudokPayloadError extends Error {}
  return {
    GudokPayloadError,
    receiveGudokReply: (reply: unknown) => replyMock(reply),
  }
})

const { action } = await import('./webhooks.gudok.expenses.$secret')
const { GudokPayloadError } = await import('@/server/services/reconciliation')

const SECRET = 'top-secret'
const REPLY = { recordsFiltered: 1, data: [{ DT_RowId: '1' }] }
// The handler only touches request + params.secret; cast past the fuller
// generated Route arg types, which aren't relevant to this test.
type Handler = (a: { request: Request; params: { secret?: string } }) => Promise<Response>
const call = (secret?: string, body = JSON.stringify(REPLY)) =>
  (action as unknown as Handler)({
    request: new Request('http://x/webhooks/gudok/expenses', { method: 'POST', body }),
    params: { secret },
  })
const expectReadable = (res: Response) =>
  expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://in.gudok.tel')

beforeEach(() => {
  mockConfig.GUDOK_WEBHOOK_SECRET = SECRET
  replyMock.mockReset()
  replyMock.mockResolvedValue({ created: 2 })
})

describe('gudok expenses webhook route', () => {
  it('Gudok reply → passes it on whole and returns the counts', async () => {
    const res = await call(SECRET)
    expect(res.status).toBe(200)
    expectReadable(res)
    expect(replyMock).toHaveBeenCalledWith(REPLY)
    expect(await res.json()).toEqual({ ok: true, created: 2 })
  })

  it('refused reply → readable 400 with the reason', async () => {
    replyMock.mockRejectedValue(new GudokPayloadError('Гудок изменился: в ответе нет строк. Ничего не записано'))
    const res = await call(SECRET, '{}')
    expect(res.status).toBe(400)
    expectReadable(res)
    expect(await res.json()).toEqual({ error: 'Гудок изменился: в ответе нет строк. Ничего не записано' })
  })

  it.each(['nope', undefined])('secret %j → readable 404, nothing received', async secret => {
    const res = await call(secret)
    expect(res.status).toBe(404)
    expectReadable(res)
    expect(replyMock).not.toHaveBeenCalled()
  })

  it('secret unset → 404, nothing received', async () => {
    mockConfig.GUDOK_WEBHOOK_SECRET = undefined
    expect((await call(SECRET)).status).toBe(404)
    expect(replyMock).not.toHaveBeenCalled()
  })

  it('broken JSON → readable 400, nothing received', async () => {
    const res = await call(SECRET, 'not json')
    expect(res.status).toBe(400)
    expectReadable(res)
    expect(replyMock).not.toHaveBeenCalled()
  })

  it('failed write → readable 500', async () => {
    vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    replyMock.mockRejectedValue(new Error('disk'))
    const res = await call(SECRET)
    expect(res.status).toBe(500)
    expectReadable(res)
    expect(await res.json()).toEqual({ error: 'Internal server error' })
  })
})

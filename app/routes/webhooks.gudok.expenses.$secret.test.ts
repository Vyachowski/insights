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
const call = (secret?: string) =>
  (action as unknown as Handler)({
    request: new Request('http://x/webhooks/gudok/expenses', {
      method: 'POST',
      body: JSON.stringify({ operations: OPERATIONS }),
    }),
    params: { secret },
  })

beforeEach(() => {
  mockEnv.GUDOK_WEBHOOK_SECRET = SECRET
  ingestMock.mockReset()
  ingestMock.mockResolvedValue({ stored: 1 })
})

describe('gudok expenses webhook route', () => {
  it('valid secret → 200 and ingests the operations', async () => {
    const res = await call(SECRET)
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://in.gudok.tel')
    expect(ingestMock).toHaveBeenCalledWith(OPERATIONS)
  })

  it.each(['nope', undefined])('secret %j → 404, no ingest', async secret => {
    await expect(call(secret)).rejects.toMatchObject({ status: 404 })
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('secret unset → 404, no ingest', async () => {
    mockEnv.GUDOK_WEBHOOK_SECRET = undefined
    await expect(call(SECRET)).rejects.toMatchObject({ status: 404 })
    expect(ingestMock).not.toHaveBeenCalled()
  })
})

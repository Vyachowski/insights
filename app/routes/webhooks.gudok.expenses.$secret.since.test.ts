import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockEnv: { GUDOK_WEBHOOK_SECRET?: string } = {}
const latestMock = vi.fn()

vi.mock('@/server/env', () => ({ env: mockEnv }))
vi.mock('@/server/services/gudok-expenses', () => ({
  latestTelephonyDate: () => latestMock(),
}))

const { loader } = await import('./webhooks.gudok.expenses.$secret.since')

const SECRET = 'top-secret'
// The handler only touches params.secret; cast past the fuller generated
// Route arg types, which aren't relevant to this test.
type Handler = (a: { params: { secret?: string } }) => Promise<Response>
const call = (secret?: string) => (loader as unknown as Handler)({ params: { secret } })

beforeEach(() => {
  mockEnv.GUDOK_WEBHOOK_SECRET = SECRET
  latestMock.mockReset()
  latestMock.mockResolvedValue('2026-10-31')
})

describe('gudok expenses since route', () => {
  it('valid secret → 200 and the latest stored day', async () => {
    const res = await call(SECRET)
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://in.gudok.tel')
    expect(await res.json()).toEqual({ since: '2026-10-31' })
  })

  it.each(['nope', undefined])('secret %j → 404, no read', async secret => {
    await expect(call(secret)).rejects.toMatchObject({ status: 404 })
    expect(latestMock).not.toHaveBeenCalled()
  })

  it('secret unset → 404, no read', async () => {
    mockEnv.GUDOK_WEBHOOK_SECRET = undefined
    await expect(call(SECRET)).rejects.toMatchObject({ status: 404 })
    expect(latestMock).not.toHaveBeenCalled()
  })
})

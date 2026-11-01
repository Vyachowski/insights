import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockEnv: { GUDOK_WEBHOOK_SECRET?: string } = {}
const sinceMock = vi.fn()

vi.mock('@/server/config', () => ({ env: mockEnv }))
vi.mock('@/server/services/gudok-expenses', () => ({
  telephonySince: () => sinceMock(),
}))

const { loader } = await import('./webhooks.gudok.expenses.$secret.since')

const SECRET = 'top-secret'
// The handler only touches params.secret; cast past the fuller generated
// Route arg types, which aren't relevant to this test.
type Handler = (a: { params: { secret?: string } }) => Promise<Response>
const call = (secret?: string) => (loader as unknown as Handler)({ params: { secret } })

beforeEach(() => {
  mockEnv.GUDOK_WEBHOOK_SECRET = SECRET
  sinceMock.mockReset()
  sinceMock.mockReturnValue('2026-10-31')
})

describe('gudok expenses since route', () => {
  it('valid secret → 200 and the date from the service', async () => {
    const res = await call(SECRET)
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://in.gudok.tel')
    expect(await res.json()).toEqual({ since: '2026-10-31' })
  })

  it.each(['nope', undefined])('secret %j → readable 404, no read', async secret => {
    const res = await call(secret)
    expect(res.status).toBe(404)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://in.gudok.tel')
    expect(sinceMock).not.toHaveBeenCalled()
  })

  it('secret unset → 404, no read', async () => {
    mockEnv.GUDOK_WEBHOOK_SECRET = undefined
    expect((await call(SECRET)).status).toBe(404)
    expect(sinceMock).not.toHaveBeenCalled()
  })

  it('failed read → readable 500', async () => {
    vi.spyOn(console, 'error').mockImplementationOnce(() => {})
    sinceMock.mockImplementation(() => { throw new Error('disk') })
    const res = await call(SECRET)
    expect(res.status).toBe(500)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://in.gudok.tel')
    expect(await res.json()).toEqual({ error: 'Internal server error' })
  })
})

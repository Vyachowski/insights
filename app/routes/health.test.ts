import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockEnv: { RAILWAY_GIT_COMMIT_SHA?: string } = {}
const pingDbMock = vi.fn()

vi.mock('@/server/env', () => ({ env: mockEnv }))
// The shared in-memory client has no pingDb, and the 503 path needs it to throw
vi.mock('@/server/db/client', () => ({ pingDb: () => pingDbMock() }))

const { loader } = await import('./health')

const SHA = 'cb50c7c1234567890abcdef1234567890abcdef0'

beforeEach(() => {
  mockEnv.RAILWAY_GIT_COMMIT_SHA = SHA
  pingDbMock.mockReset()
})

describe('health route', () => {
  it('reports the first 7 characters of the commit', async () => {
    const res = await loader()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok', db: 'up', version: 'cb50c7c' })
  })

  it.each([undefined, ''])('reports dev when the commit is %j', async sha => {
    mockEnv.RAILWAY_GIT_COMMIT_SHA = sha
    const res = await loader()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok', db: 'up', version: 'dev' })
  })

  it('keeps the version on the 503 path', async () => {
    pingDbMock.mockImplementation(() => {
      throw new Error('db gone')
    })
    const res = await loader()
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ status: 'degraded', db: 'down', version: 'cb50c7c' })
  })
})

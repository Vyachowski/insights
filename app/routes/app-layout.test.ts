import { describe, expect, it, vi } from 'vitest'

vi.mock('@/server/services/auth', () => ({
  findActiveUser: async (id: string) => ({ id, role: id === 'admin' ? 'ADMIN' : 'USER' }),
}))
vi.mock('@/server/services/reconciliation', () => ({
  checkReconciliationStale: async () => true,
}))

vi.stubEnv('JWT_SECRET', 'test-secret')
vi.stubEnv('JWT_MAX_AGE', '60000')

const { loader } = await import('./app-layout')
const { createUserSession } = await import('@/routes/helpers/auth')

const callLoader = async (userId: string) => {
  const Cookie = (await createUserSession(userId, '/')).headers.get('Set-Cookie') ?? ''
  const request = new Request('http://test/', { headers: { Cookie } })
  return loader({ request } as Parameters<typeof loader>[0])
}

describe('app layout loader', () => {
  it('tells the admin about a stale reconciliation', async () => {
    expect(await callLoader('admin')).toMatchObject({ reconciliationStale: true })
  })

  it('hides it from a user', async () => {
    expect(await callLoader('user')).toMatchObject({ reconciliationStale: false })
  })
})

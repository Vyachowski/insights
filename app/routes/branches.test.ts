import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sqlite } from '@/server/db/client'

vi.mock('@/server/services/auth', () => ({
  findActiveUser: async (id: string) => ({ id, role: id === 'admin' ? 'ADMIN' : 'USER' }),
}))

vi.stubEnv('JWT_SECRET', 'test-secret')
vi.stubEnv('JWT_MAX_AGE', '60000')

const { action, loader } = await import('./branches')
const { createUserSession } = await import('@/routes/helpers/auth')

const sessionCookie = async (userId: string) =>
  (await createUserSession(userId, '/')).headers.get('Set-Cookie') ?? ''

const callAction = async (userId: string | null, fields: Record<string, string>) => {
  const body = new FormData()
  for (const [key, value] of Object.entries(fields)) body.set(key, value)
  const headers = userId ? { Cookie: await sessionCookie(userId) } : undefined
  const request = new Request('http://test/branches', { method: 'POST', body, headers })
  return action({ request } as Parameters<typeof action>[0])
}

const FORM = {
  intent: 'save',
  provider: 'gudok',
  providerNumberId: '1',
  nextDate: '2026-11-26',
  amount: '870',
}

const schedules = () => sqlite.prepare('SELECT * FROM charge_schedules').all()

beforeEach(() => {
  sqlite.exec(`
    DELETE FROM charge_schedules; DELETE FROM phone_numbers; DELETE FROM expenses;
    DELETE FROM sites; DELETE FROM cities;
    INSERT INTO cities (id, code, slug, name, population, created_at, updated_at)
      VALUES (1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);
    INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at)
      VALUES (5, 1, 'https://volgograd.example.com/', '111', 0, 0);
    INSERT INTO phone_numbers (provider, provider_number_id, site_id, created_at, updated_at)
      VALUES ('gudok', '1', 5, 0, 0);
  `)
})

describe('branches action', () => {
  it('lets the admin switch a number on and off', async () => {
    const on = await callAction('admin', FORM)

    expect(on.status).toBe(200)
    expect(await on.json()).toEqual({ ok: true, outcome: 'on' })
    expect(schedules()).toMatchObject([{ enabled: 1, amount: 87000 }])

    const off = await callAction('admin', { ...FORM, intent: 'switch-off' })

    expect(await off.json()).toEqual({ ok: true, outcome: 'off' })
    expect(schedules()).toMatchObject([{ enabled: 0 }])
  })

  it('answers a refused write with 400 and the message', async () => {
    const response = await callAction('admin', { ...FORM, amount: '0' })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Укажите сумму больше нуля' })
  })

  it('refuses a signed-in user with 403 and writes nothing', async () => {
    const refused: unknown = await callAction('user', FORM).catch((thrown: unknown) => thrown)

    expect(refused).toBeInstanceOf(Response)
    expect((refused as Response).status).toBe(403)
    expect(schedules()).toEqual([])
  })

  it('sends a guest to the login page and writes nothing', async () => {
    const refused: unknown = await callAction(null, FORM).catch((thrown: unknown) => thrown)

    expect((refused as Response).headers.get('Location')).toBe('/login')
    expect(schedules()).toEqual([])
  })
})

describe('branches loader', () => {
  it('gives a signed-in user the numbers with their offer', async () => {
    sqlite.exec(
      'INSERT INTO expenses (date, site_id, amount, type, created_at, updated_at) '
      + "VALUES ('2026-10-27', 5, 87000, 'telephony', 0, 0)",
    )
    const request = new Request('http://test/branches', { headers: { Cookie: await sessionCookie('user') } })

    const { numbers } = await loader({ request } as Parameters<typeof loader>[0])

    expect(numbers).toMatchObject([{ enabled: false, offer: { nextDate: '2026-11-26', amount: 870 } }])
  })
})

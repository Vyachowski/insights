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

const HOSTING_FORM = {
  intent: 'save',
  hostingId: '1',
  nextDate: '2027-03-15',
  amount: '12000',
}

const schedules = () => sqlite.prepare('SELECT * FROM charge_schedules').all()

const loadHostings = async (userId: string) => {
  const request = new Request('http://test/branches', { headers: { Cookie: await sessionCookie(userId) } })
  return (await loader({ request } as Parameters<typeof loader>[0])).hostings
}

const seedHostingCharge = (date: string, amount: number, hostingId = 1) => sqlite.prepare(
  "INSERT INTO expenses (date, hosting_id, amount, type, created_at, updated_at) VALUES (?, ?, ?, 'hosting', 0, 0)",
).run(date, hostingId, amount)

beforeEach(() => {
  sqlite.exec(`
    DELETE FROM charge_schedules; DELETE FROM phone_numbers; DELETE FROM expenses;
    DELETE FROM sites; DELETE FROM cities; DELETE FROM hostings;
    INSERT INTO cities (id, code, slug, name, population, created_at, updated_at)
      VALUES (1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);
    INSERT INTO hostings (id, provider, account, created_at, updated_at) VALUES
      (1, 'sprinthost', 'a0181620', 0, 0),
      (2, 'sprinthost', 'b0000000', 0, 0);
    INSERT INTO sites (id, city_id, url, yandex_counter_id, hosting_id, created_at, updated_at) VALUES
      (5, 1, 'https://volgograd.example.com/', '111', 1, 0, 0),
      (6, 1, 'https://volzhsky.example.com/', '222', 1, 0, 0),
      (7, 1, 'https://kamyshin.example.com/', '333', NULL, 0, 0);
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

describe('branches action for a hosting', () => {
  it('lets the admin switch on, edit and switch off', async () => {
    const on = await callAction('admin', HOSTING_FORM)

    expect(await on.json()).toEqual({ ok: true, outcome: 'on' })
    expect(schedules()).toMatchObject([{
      hosting_id: 1,
      provider: null,
      enabled: 1,
      next_date: '2027-03-15',
      amount: 1200000,
      interval_days: null,
      interval_months: 12,
    }])

    const edit = await callAction('admin', { ...HOSTING_FORM, nextDate: '2027-04-01', amount: '13000' })

    expect(await edit.json()).toEqual({ ok: true, outcome: 'updated' })
    expect(schedules()).toMatchObject([{ enabled: 1, next_date: '2027-04-01', amount: 1300000 }])

    const off = await callAction('admin', { intent: 'switch-off', hostingId: '1' })

    expect(await off.json()).toEqual({ ok: true, outcome: 'off' })
    expect(schedules()).toMatchObject([{ enabled: 0, next_date: '2027-04-01', amount: 1300000 }])
  })

  it('keeps the rows written before switching off', async () => {
    seedHostingCharge('2026-03-15', 1200000)
    await callAction('admin', HOSTING_FORM)

    await callAction('admin', { intent: 'switch-off', hostingId: '1' })

    expect(sqlite.prepare('SELECT date FROM expenses').all()).toEqual([{ date: '2026-03-15' }])
  })

  it('switches on again with the new values, in one row', async () => {
    await callAction('admin', HOSTING_FORM)
    await callAction('admin', { intent: 'switch-off', hostingId: '1' })

    const on = await callAction('admin', { ...HOSTING_FORM, nextDate: '2028-01-10', amount: '14000' })

    expect(await on.json()).toEqual({ ok: true, outcome: 'on' })
    expect(schedules()).toMatchObject([{ enabled: 1, next_date: '2028-01-10', amount: 1400000, interval_months: 12 }])
  })

  it('allows a next date in the past', async () => {
    const response = await callAction('admin', { ...HOSTING_FORM, nextDate: '2020-01-01' })

    expect(response.status).toBe(200)
    expect(schedules()).toMatchObject([{ next_date: '2020-01-01' }])
  })

  it.each([
    [{ nextDate: '2027-02-30' }, 'Укажите дату'],
    [{ nextDate: '' }, 'Укажите дату'],
    [{ amount: '0' }, 'Укажите сумму больше нуля'],
    [{ amount: '-1' }, 'Укажите сумму больше нуля'],
  ])('refuses %j and writes nothing', async (form, error) => {
    const response = await callAction('admin', { ...HOSTING_FORM, ...form })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error })
    expect(schedules()).toEqual([])
  })

  it.each(['99', 'abc', ''])('refuses the unknown hosting %j', async hostingId => {
    const response = await callAction('admin', { ...HOSTING_FORM, hostingId })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Хостинг не найден' })
    expect(schedules()).toEqual([])
  })

  it('ignores an interval sent in the form', async () => {
    await callAction('admin', { ...HOSTING_FORM, intervalMonths: '1', intervalDays: '30' })

    expect(schedules()).toMatchObject([{ interval_days: null, interval_months: 12 }])
  })

  it('refuses an unknown intent', async () => {
    const response = await callAction('admin', { intent: 'other', hostingId: '1' })

    expect(await response.json()).toEqual({ error: 'Неизвестное действие' })
  })

  it('refuses a signed-in user with 403 and writes nothing', async () => {
    const refused: unknown = await callAction('user', HOSTING_FORM).catch((thrown: unknown) => thrown)

    expect((refused as Response).status).toBe(403)
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

  it.each(['admin', 'user'])('gives the %s each hosting off, with no offer when it has no row', async userId => {
    expect(await loadHostings(userId)).toEqual([
      { id: 1, provider: 'sprinthost', account: 'a0181620', siteCount: 2, enabled: false, nextDate: null, amount: null, offer: null },
      { id: 2, provider: 'sprinthost', account: 'b0000000', siteCount: 0, enabled: false, nextDate: null, amount: null, offer: null },
    ])
  })

  it('gives a hosting that is on its next date and amount in rubles', async () => {
    await callAction('admin', HOSTING_FORM)

    expect((await loadHostings('user'))[0]).toMatchObject({ siteCount: 2, enabled: true, nextDate: '2027-03-15', amount: 12000 })
  })

  it('offers the last row of this hosting + 12 months and its amount', async () => {
    seedHostingCharge('2025-03-15', 1100000)
    seedHostingCharge('2026-03-15', 1200050)
    seedHostingCharge('2026-09-01', 500000, 2)

    const [first, second] = await loadHostings('admin')

    expect(first.offer).toEqual({ nextDate: '2027-03-15', amount: 12000.5 })
    expect(second.offer).toEqual({ nextDate: '2027-09-01', amount: 5000 })
  })

  it('offers fresh values after off and hides the stored ones', async () => {
    await callAction('admin', HOSTING_FORM)
    await callAction('admin', { intent: 'switch-off', hostingId: '1' })
    seedHostingCharge('2026-08-01', 1300000)

    expect((await loadHostings('admin'))[0]).toMatchObject({
      enabled: false,
      nextDate: null,
      amount: null,
      offer: { nextDate: '2027-08-01', amount: 13000 },
    })
  })

  it('offers nothing from a hosting row with a site or no hosting', async () => {
    sqlite.exec(`
      INSERT INTO expenses (date, site_id, amount, type, created_at, updated_at) VALUES ('2026-01-01', 5, 100, 'hosting', 0, 0);
      INSERT INTO expenses (date, amount, type, created_at, updated_at) VALUES ('2026-01-02', 200, 'hosting', 0, 0);
    `)

    expect((await loadHostings('admin'))[0].offer).toBeNull()
  })
})

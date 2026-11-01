import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sumAmounts } from '@/lib/totals'
import { sqlite } from '@/server/db/client'

vi.mock('@/routes/helpers/auth', () => ({ requireAdmin: async () => undefined, requireUser: async () => undefined }))

const { action, loader } = await import('./finance')
const { importers } = await import('@/server/services/csv-imports')

const callAction = (fields: Record<string, string>) => {
  const body = new FormData()
  for (const [key, value] of Object.entries(fields)) body.set(key, value)
  const request = new Request('http://test/finance', { method: 'POST', body })
  return action({ request } as Parameters<typeof action>[0])
}

const callLoader = (tab: string) => loader({
  request: new Request(`http://test/finance?tab=${tab}`),
} as Parameters<typeof loader>[0])

const rows = (table: string) => sqlite.prepare(`SELECT * FROM ${table}`).all()

const firstHostingId = () => (rows('hostings') as { id: number }[])[0].id

beforeEach(() => {
  sqlite.exec(`
    DELETE FROM revenues; DELETE FROM expenses; DELETE FROM sites; DELETE FROM cities;
    DELETE FROM hostings WHERE provider <> 'sprinthost';
    INSERT INTO cities (id, code, slug, name, population, created_at, updated_at)
      VALUES (1, 'SAM', 'samara', 'Самара', 100, 0, 0);
    INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at)
      VALUES (5, 1, 'https://samara.example.com/', '111', 0, 0);
  `)
})

describe('finance action', () => {
  it('adds revenue in kopecks and reports the outcome', async () => {
    const form = { intent: 'add-revenue', date: '2026-03-01', siteId: '5', amount: '100.55' }

    expect(await (await callAction(form)).json()).toEqual({ ok: true, outcome: 'created' })
    expect(await (await callAction(form)).json()).toEqual({ ok: true, outcome: 'skipped' })
    expect(rows('revenues')).toMatchObject([{ site_id: 5, date: '2026-03-01', amount: 10055 }])
  })

  it('stores a company-level revenue with an empty site', async () => {
    await callAction({ intent: 'add-revenue', date: '2026-03-01', siteId: '', amount: '10' })

    expect(rows('revenues')).toMatchObject([{ site_id: null }])
  })

  describe('add-hosting', () => {
    const addHosting = (fields: Record<string, string> = {}) => callAction({
      intent: 'add-hosting',
      hostingId: String(firstHostingId()),
      date: '2026-03-15',
      amount: '500',
      ...fields,
    })

    it('stores a real row on the date for the hosting, with no site', async () => {
      const response = await addHosting({ siteId: '5' })

      expect(await response.json()).toEqual({ ok: true, outcome: 'created' })
      expect(rows('expenses')).toMatchObject([{
        date: '2026-03-15',
        hosting_id: firstHostingId(),
        site_id: null,
        type: 'hosting',
        amount: 50000,
        is_estimate: 0,
      }])
    })

    it('overwrites the amount on the same hosting and date', async () => {
      await addHosting()

      const response = await addHosting({ amount: '700' })

      expect(await response.json()).toEqual({ ok: true, outcome: 'updated' })
      expect(rows('expenses')).toMatchObject([{ amount: 70000 }])
    })

    it('reports a repeated entry as skipped', async () => {
      await addHosting()

      expect(await (await addHosting()).json()).toEqual({ ok: true, outcome: 'skipped' })
      expect(rows('expenses')).toHaveLength(1)
    })

    it('keeps two hostings apart on one date', async () => {
      sqlite.exec("INSERT INTO hostings (id, provider, account, created_at, updated_at) VALUES (99, 'second', 'b1', 0, 0)")

      await addHosting()
      await addHosting({ hostingId: '99', amount: '700' })

      expect(rows('expenses')).toMatchObject([{ amount: 50000 }, { hosting_id: 99, amount: 70000 }])
    })

    it('links a row from an expense CSV and adds no second row', async () => {
      await importers.expenses(Buffer.from('date,type,siteId,amount\n2026-03-15,hosting,,300'))

      const response = await addHosting()

      expect(await response.json()).toEqual({ ok: true, outcome: 'updated' })
      expect(rows('expenses')).toMatchObject([{ hosting_id: firstHostingId(), site_id: null, amount: 50000 }])
    })

    it.each(['99', 'abc', ''])('refuses the unknown hosting %j and writes nothing', async hostingId => {
      const response = await addHosting({ hostingId })

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Хостинг не найден' })
      expect(rows('expenses')).toEqual([])
    })

    it('refuses a bad date and writes nothing', async () => {
      const response = await addHosting({ date: '2026-02-30' })

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Укажите дату' })
      expect(rows('expenses')).toEqual([])
    })
  })

  it.each([
    [{ intent: 'add-revenue', date: '2026-03-01', siteId: '', amount: '0' }, 'Укажите сумму больше нуля'],
    [{ intent: 'add-revenue', date: '2026-03-01', siteId: 'abc', amount: '10' }, 'Некорректный сайт'],
    [{ intent: 'add-revenue', date: '2026-02-30', siteId: '', amount: '10' }, 'Укажите дату'],
    [{ intent: 'other', siteId: '', amount: '10' }, 'Неизвестное действие'],
  ])('rejects %j', async (form, error) => {
    const response = await callAction(form)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error })
    expect(rows('revenues')).toEqual([])
  })

  describe('delete-revenue', () => {
    beforeEach(() => {
      sqlite.exec(`
        INSERT INTO revenues (id, site_id, date, amount, created_at, updated_at) VALUES
          (1, 5, '2026-03-01', 10000, 0, 0),
          (2, NULL, '2026-03-02', 20000, 0, 0);
      `)
    })

    it.each([
      [1, 2],
      [2, 1],
    ])('deletes row %i and keeps row %i', async (id, kept) => {
      const response = await callAction({ intent: 'delete-revenue', id: String(id) })

      expect(await response.json()).toEqual({ ok: true, outcome: 'deleted' })
      expect(rows('revenues')).toMatchObject([{ id: kept }])
    })

    it('stays gone on the next load', async () => {
      await callAction({ intent: 'delete-revenue', id: '1' })

      expect((await callLoader('revenue')).revenues).toMatchObject([{ id: 2 }])
    })

    it('reports a repeated delete as skipped', async () => {
      await callAction({ intent: 'delete-revenue', id: '1' })
      const response = await callAction({ intent: 'delete-revenue', id: '1' })

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ ok: true, outcome: 'skipped' })
    })

    it('refuses a bad id and deletes nothing', async () => {
      const response = await callAction({ intent: 'delete-revenue', id: 'abc' })

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Некорректная запись' })
      expect(rows('revenues')).toHaveLength(2)
    })
  })
})

describe('finance loader', () => {
  it('returns revenue in rubles by default and the sites', async () => {
    sqlite.exec("INSERT INTO revenues (site_id, date, amount, created_at, updated_at) VALUES (5, '2026-01-01', 12345, 0, 0)")

    const data = await callLoader('revenue')

    expect(data.revenues).toMatchObject([{ amount: 123.45 }])
    expect(data.sites).toMatchObject([{ id: 5 }])
  })

  it('returns expenses in rubles on their tab', async () => {
    sqlite.exec("INSERT INTO expenses (site_id, date, amount, type, created_at, updated_at) VALUES (5, '2026-01-01', 500, 'ads', 0, 0)")

    const data = await callLoader('expenses')

    expect(data.expenses).toMatchObject([{ amount: 5, type: 'ads' }])
  })

  it('marks estimates in the expenses and counts them in the total', async () => {
    sqlite.exec(`
      INSERT INTO expenses (site_id, date, amount, type, is_estimate, created_at, updated_at) VALUES
        (5, '2026-01-01', 50000, 'telephony', 0, 0, 0),
        (5, '2026-01-31', 87000, 'telephony', 1, 0, 0);
    `)

    const { expenses } = await callLoader('expenses')

    expect(expenses).toMatchObject([{ amount: 500, isEstimate: false }, { amount: 870, isEstimate: true }])
    expect(sumAmounts(expenses)).toBe(1370)
  })

  it.each(['revenue', 'expenses'])('passes the hostings on the %s tab', async tab => {
    expect((await callLoader(tab)).hostings).toEqual([
      { id: firstHostingId(), provider: 'sprinthost', account: 'a0181620' },
    ])
  })
})

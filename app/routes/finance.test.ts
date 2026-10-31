import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sqlite } from '@/server/db/client'

vi.mock('@/server/auth', () => ({ requireAdmin: async () => undefined, requireUser: async () => undefined }))

const { action, loader } = await import('./finance')

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

beforeEach(() => {
  sqlite.exec(`
    DELETE FROM revenues; DELETE FROM expenses; DELETE FROM sites; DELETE FROM cities;
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

  it('stores hosting on January 1 of the year', async () => {
    await callAction({ intent: 'add-hosting', year: '2026', siteId: '5', amount: '500' })

    expect(rows('expenses')).toMatchObject([{ date: '2026-01-01', type: 'hosting', amount: 50000 }])
  })

  it.each([
    [{ intent: 'add-revenue', date: '2026-03-01', siteId: '', amount: '0' }, 'Укажите сумму больше нуля'],
    [{ intent: 'add-revenue', date: '2026-03-01', siteId: 'abc', amount: '10' }, 'Некорректный сайт'],
    [{ intent: 'add-revenue', date: '2026-02-30', siteId: '', amount: '10' }, 'Укажите дату'],
    [{ intent: 'add-hosting', year: '1999', siteId: '', amount: '10' }, 'Укажите год'],
    [{ intent: 'other', siteId: '', amount: '10' }, 'Неизвестное действие'],
  ])('rejects %j', async (form, error) => {
    const response = await callAction(form)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error })
    expect(rows('revenues')).toEqual([])
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
})

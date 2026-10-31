import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { sqlite } from '@/server/db/client'

const { getDashboardSummary } = await import('@/server/services/dashboard')
const { listCalls } = await import('./calls')

const NOW = new Date(2026, 5, 15, 12)
const THIS_YEAR = new Date(2026, 2, 1, 12).getTime()
const LAST_YEAR = new Date(2025, 2, 1, 12).getTime()

let nextId = 1
function insertCall(call: { site: number | null; src: string; date?: number; callNumber?: number; source?: string; numberId?: string }) {
  sqlite
    .prepare(`INSERT INTO calls (site_id, provider, provider_number_id, src, call_number, date, source, raw, created_at, updated_at)
      VALUES (?, 'gudok', ?, ?, ?, ?, ?, '{}', 0, 0)`)
    .run(call.site, call.numberId ?? null, call.src, call.callNumber ?? 1, call.date ?? THIS_YEAR + nextId++, call.source ?? 'webhook')
}

beforeAll(() => {
  vi.useFakeTimers({ now: NOW, toFake: ['Date'] })
})

afterAll(() => {
  vi.useRealTimers()
})

beforeEach(() => {
  sqlite.exec('DELETE FROM calls; DELETE FROM phone_numbers; DELETE FROM sites; DELETE FROM cities;')
  sqlite.exec(`
    INSERT INTO cities (id, code, slug, name, population, created_at, updated_at)
      VALUES (1, 'SAM', 'samara', 'Самара', 100, 0, 0), (2, 'KZN', 'kazan', 'Казань', 100, 0, 0);
    INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at)
      VALUES (1, 1, 'https://samara.example.com/', '1', 0, 0), (2, 2, 'https://kazan.example.com/', '2', 0, 0);
  `)
})

describe('getDashboardSummary calls', () => {
  it('counts unique first callers from webhook and CSV rows together', async () => {
    insertCall({ site: 1, src: 'a', source: 'csv' })
    insertCall({ site: 1, src: 'a' })
    insertCall({ site: 1, src: 'b' })
    insertCall({ site: 2, src: 'c', source: 'csv' })

    const { trends, callsByCity } = await getDashboardSummary()

    expect(trends.calls.current).toBe(3)
    expect(callsByCity).toMatchObject([
      { city: 'Самара', current: 2, previous: 0 },
      { city: 'Казань', current: 1, previous: 0 },
    ])
  })

  it('leaves out repeat calls, no-site calls and calls outside the window', async () => {
    insertCall({ site: 1, src: 'repeat', callNumber: 2 })
    insertCall({ site: null, src: 'no-site' })
    insertCall({ site: 1, src: 'future', date: new Date(2026, 6, 1).getTime() })

    const { trends, callsByCity } = await getDashboardSummary()

    expect(trends.calls.current).toBe(0)
    expect(callsByCity).toMatchObject([])
  })

  it('counts the same window last year as previous', async () => {
    insertCall({ site: 1, src: 'a', date: LAST_YEAR })
    const { trends } = await getDashboardSummary()
    expect(trends.calls).toMatchObject({ current: 0, previous: 1 })
  })
})

describe('listCalls', () => {
  it('shows webhook and CSV calls, with city and number name', async () => {
    sqlite.exec(`INSERT INTO phone_numbers (provider, provider_number_id, site_id, name, created_at, updated_at)
      VALUES ('gudok', '4635', 1, 'Самара', 0, 0)`)
    insertCall({ site: 1, src: 'a', source: 'csv', numberId: '4635' })
    insertCall({ site: 1, src: 'b', numberId: '4635' })
    insertCall({ site: null, src: 'c', numberId: 'unknown' })

    const rows = await listCalls()

    expect(rows.map(row => [row.source, row.city, row.channel])).toEqual([
      ['csv', 'Самара', 'Самара'],
      ['webhook', 'Самара', 'Самара'],
      ['webhook', null, null],
    ])
  })
})

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import * as schema from '@/server/schema'
import { applyMigrations } from '@/server/test-migrations'

const sqlite = new Database(':memory:')
const testDb = drizzle(sqlite, { schema })

vi.mock('@/server/db', () => ({ db: testDb }))

const { getDashboardSummary } = await import('./dashboard')

const instant = (iso: string) => Date.parse(iso)

function seed() {
  sqlite.exec(`
    INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES
      (1, 'SAM', 'samara', 'Самара', 100, 0, 0),
      (2, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);
    INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES
      (5, 1, 'https://samara.example.com/', '111', 0, 0);
    INSERT INTO revenues (site_id, date, amount, created_at, updated_at) VALUES
      (5, '2026-01-10', 100000, 0, 0),
      (NULL, '2026-02-10', 50000, 0, 0),
      (5, '2025-01-10', 80000, 0, 0),
      (5, '2025-12-10', 999900, 0, 0);
    INSERT INTO expenses (site_id, date, amount, type, created_at, updated_at) VALUES
      (5, '2026-01-20', 30000, 'ads', 0, 0),
      (NULL, '2025-02-01', 10000, 'ads', 0, 0);
  `)
  const call = sqlite.prepare(`
    INSERT INTO calls (site_id, provider, src, call_number, date, source, raw, created_at, updated_at)
    VALUES (?, 'gudok', ?, ?, ?, 'webhook', '{}', 0, 0)
  `)
  call.run(5, '79110000001', 1, instant('2026-01-05T10:00:00Z'))
  call.run(5, '79110000001', 1, instant('2026-02-05T10:00:00Z')) // same caller
  call.run(5, '79110000002', 2, instant('2026-02-05T10:00:00Z')) // repeat call
  call.run(null, '79110000003', 1, instant('2026-02-05T10:00:00Z')) // no site
  call.run(5, '79110000004', 1, instant('2025-02-05T10:00:00Z'))
  call.run(5, '79110000005', 1, instant('2025-06-05T10:00:00Z')) // past the window
}

beforeAll(() => {
  applyMigrations(sqlite)
  seed()
  vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-03-15T12:00:00Z') })
})

afterAll(() => {
  vi.useRealTimers()
})

describe('getDashboardSummary', () => {
  it('compares this year with the same window of last year, in rubles', async () => {
    const { trends, verdict } = await getDashboardSummary()

    expect(trends.revenue).toMatchObject({ current: 1500, previous: 800 })
    expect(trends.expenses).toMatchObject({ current: 300, previous: 100 })
    expect(verdict).toMatchObject({
      isGrowing: true,
      isStrong: true,
      growthPercent: 71.4,
      current: 1200,
      previous: 700,
    })
  })

  it('counts unique first callers with a site', async () => {
    const { trends, callsByCity } = await getDashboardSummary()

    expect(trends.calls).toMatchObject({ current: 1, previous: 1 })
    expect(callsByCity).toEqual([{ city: 'Самара', current: 1, previous: 1 }])
  })

  it('builds twelve months of profit and averages the months with data', async () => {
    const { monthlyProfit, verdict } = await getDashboardSummary()

    expect(monthlyProfit.months).toHaveLength(12)
    expect(monthlyProfit.months[0]).toEqual({ month: 1, current: 700, previous: 800 })
    expect(monthlyProfit.months[1]).toEqual({ month: 2, current: 500, previous: -100 })
    expect(monthlyProfit.months[11]).toEqual({ month: 12, current: 0, previous: 9999 })
    expect(monthlyProfit).toMatchObject({ elapsedMonths: 2, averageCurrent: 600, averagePrevious: 350 })
    expect(verdict).toMatchObject({ monthlyCurrent: 600, monthlyPrevious: 350 })
  })
})

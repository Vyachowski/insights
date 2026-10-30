import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import * as schema from '@/server/schema'
import { applyMigrations } from '@/server/test-migrations'

// Real in-memory SQLite built from the committed migrations, shared with the
// module under test via the db mock below.
const sqlite = new Database(':memory:')
const testDb = drizzle(sqlite, { schema })

vi.mock('@/server/db', () => ({ db: testDb }))

const { CsvValidationError, importers } = await import('@/server/imports')

const METRIC_COLUMNS = [
  'yandexUsers',
  'googleUsers',
  'otherUsers',
  'visitDurationYandexInSec',
  'visitDurationGoogleInSec',
  'visitDurationOtherInSec',
  'bounceYandex',
  'bounceGoogle',
  'bounceOther',
  'leadsYandex',
  'leadsGoogle',
  'leadsOther',
]

const csv = (...lines: string[]) => Buffer.from(lines.join('\n'))
const revenueCsv = (...lines: string[]) => csv('date,siteId,amount', ...lines)
const expensesCsv = (...lines: string[]) => csv('date,type,siteId,amount', ...lines)
const metricsCsv = (...lines: string[]) =>
  csv(['siteId', 'date', ...METRIC_COLUMNS].join(','), ...lines)
const metricRow = (siteId: string, date: string) =>
  [siteId, date, ...METRIC_COLUMNS.map(() => '1')].join(',')

const rows = (table: string) => sqlite.prepare(`SELECT * FROM ${table}`).all()
const siteIds = (table: string) =>
  sqlite.prepare(`SELECT site_id AS siteId FROM ${table}`).all()

beforeAll(() => {
  applyMigrations(sqlite)
})

beforeEach(() => {
  sqlite.exec(`
    DELETE FROM site_metrics; DELETE FROM revenues; DELETE FROM expenses;
    DELETE FROM sites; DELETE FROM cities;
    INSERT INTO cities (id, code, slug, name, population, created_at, updated_at)
      VALUES (1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);
    INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at)
      VALUES (5, 1, 'https://volgograd.example.com/', '111', 0, 0);
  `)
})

describe('rejected files', () => {
  it.each([
    ['revenue', 'revenues', revenueCsv('2026-01-01,,100', 'bad,,1', 'bad,,2')],
    ['expenses', 'expenses', expensesCsv('2026-01-01,ads,,100', 'bad,ads,,1', 'bad,ads,,2')],
    ['metrics', 'site_metrics', metricsCsv(metricRow('5', '2026-01-01'), metricRow('5', 'bad'), metricRow('5', 'worse'))],
  ] as const)('a %s file over the invalid limit writes nothing', async (resource, table, file) => {
    await expect(importers[resource](file)).rejects.toBeInstanceOf(CsvValidationError)

    expect(rows(table)).toEqual([])
  })
})

describe('siteId cells', () => {
  it.each(['abc', '999'])('drops a revenue row with siteId %s', async siteId => {
    const result = await importers.revenue(
      revenueCsv(`2026-01-01,${siteId},100`, '2026-01-02,5,200', '2026-01-03,,300'),
    )

    expect(result).toEqual({ created: 2, updated: 0, skipped: 0 })
    expect(siteIds('revenues')).toEqual([{ siteId: 5 }, { siteId: null }])
  })

  it.each(['abc', '999'])('drops an expense row with siteId %s', async siteId => {
    const result = await importers.expenses(
      expensesCsv(`2026-01-01,ads,${siteId},100`, '2026-01-02,ads,5,200', '2026-01-03,ads,,300'),
    )

    expect(result).toEqual({ created: 2, updated: 0, skipped: 0 })
    expect(siteIds('expenses')).toEqual([{ siteId: 5 }, { siteId: null }])
  })

  it.each(['abc', '999', ''])('drops a metrics row with siteId "%s"', async siteId => {
    const result = await importers.metrics(
      metricsCsv(metricRow(siteId, '2026-01-01'), metricRow('5', '2026-01-02')),
    )

    expect(result).toEqual({ created: 1, skipped: 1 })
    expect(siteIds('site_metrics')).toEqual([{ siteId: 5 }])
  })
})

describe('amount cells', () => {
  it.each(['', '100,50', '100abc'])('drops the amount "%s"', async amount => {
    const result = await importers.revenue(
      csv('date,siteId,amount', `2026-01-01,,"${amount}"`, '2026-01-02,,200'),
    )

    expect(result).toEqual({ created: 1, updated: 0, skipped: 0 })
  })

  it('stores integer kopecks', async () => {
    await importers.expenses(expensesCsv('2026-01-01,ads,5,100.55'))

    expect(rows('expenses')).toMatchObject([{ amount: 10055 }])
  })
})

describe('re-importing a file', () => {
  it('skips revenue with the same amount and overwrites a changed one', async () => {
    await importers.revenue(revenueCsv('2026-01-01,,100', '2026-01-02,5,200'))

    const result = await importers.revenue(revenueCsv('2026-01-01,,100', '2026-01-02,5,250'))

    expect(result).toEqual({ created: 0, updated: 1, skipped: 1 })
    expect(rows('revenues')).toMatchObject([{ amount: 10000 }, { amount: 25000 }])
  })

  it('skips expenses with the same amount and overwrites a changed one', async () => {
    await importers.expenses(expensesCsv('2026-01-01,ads,,100', '2026-01-02,ads,5,200'))

    const result = await importers.expenses(expensesCsv('2026-01-01,ads,,100', '2026-01-02,ads,5,250'))

    expect(result).toEqual({ created: 0, updated: 1, skipped: 1 })
    expect(rows('expenses')).toMatchObject([{ amount: 10000 }, { amount: 25000 }])
  })

  it('overwrites metrics for the same site and date', async () => {
    await importers.metrics(metricsCsv(metricRow('5', '2026-01-01')))

    const result = await importers.metrics(metricsCsv(metricRow('5', '2026-01-01')))

    expect(result).toEqual({ created: 1, skipped: 0 })
    expect(rows('site_metrics')).toHaveLength(1)
  })
})

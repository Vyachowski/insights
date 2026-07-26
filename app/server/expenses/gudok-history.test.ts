import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import * as schema from '@/server/schema'

const sqlite = new Database(':memory:')
const testDb = drizzle(sqlite, { schema })

vi.mock('@/server/db', () => ({ db: testDb }))

function applyMigrations() {
  const dir = path.resolve(__dirname, '../../../drizzle')
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()
  sqlite.exec('PRAGMA foreign_keys=OFF;')
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8')
    for (const stmt of sql.split('--> statement-breakpoint')) {
      const trimmed = stmt.trim()
      if (trimmed) sqlite.exec(trimmed)
    }
  }
}

const {
  parseGudokAmountKopecks,
  parseGudokOperationDate,
  cleanProject,
  ingestGudokExpenses,
  latestTelephonyDate,
} = await import('./gudok-history')

beforeAll(() => {
  applyMigrations()
})

beforeEach(() => {
  sqlite.exec('DELETE FROM expenses; DELETE FROM sites; DELETE FROM cities;')
  sqlite.exec(
    'INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES '
    + "(1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0), "
    + "(2, 'RND', 'rostov', 'Ростов-На-Дону', 100, 0, 0);",
  )
  sqlite.exec(
    'INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES '
    + "(5, 1, 'https://volgograd.example.com/', '111', 0, 0), "
    + "(6, 2, 'https://rostov.example.com/', '222', 0, 0);",
  )
})

function expenseRows() {
  return sqlite.prepare('SELECT * FROM expenses ORDER BY date, site_id').all() as Record<string, unknown>[]
}

const charge = (over: Record<string, unknown> = {}) => ({
  date: '26.07.2026',
  text: 'Продление: Гудок-номер +7 844 260 69 54',
  project: 'Волгоград..',
  kind: 'Списание',
  amount: '-870,000 i',
  ...over,
})

describe('parseGudokAmountKopecks', () => {
  it('parses comma-decimal ruble strings to positive kopecks', () => {
    expect(parseGudokAmountKopecks('-870,000 i')).toBe(87000)
    expect(parseGudokAmountKopecks('870,000')).toBe(87000)
    expect(parseGudokAmountKopecks('-1 234,50')).toBe(123450)
  })
  it('returns null on garbage', () => {
    expect(parseGudokAmountKopecks('—')).toBeNull()
  })
})

describe('parseGudokOperationDate', () => {
  it('parses DD.MM.YY and DD.MM.YYYY', () => {
    expect(parseGudokOperationDate('26.07.26')).toBe('2026-07-26')
    expect(parseGudokOperationDate('24.07.2026')).toBe('2026-07-24')
  })
})

describe('cleanProject', () => {
  it('strips trailing dots', () => {
    expect(cleanProject('Волгоград..')).toBe('Волгоград')
  })
})

describe('ingestGudokExpenses', () => {
  it('records only charges, resolves site, stores positive kopecks', async () => {
    const result = await ingestGudokExpenses([
      charge(),
      { date: '26.07.2026', project: '..', kind: 'Пополнение', amount: '870,000 i', text: 'Пополнение' },
    ])
    expect(result).toEqual({ created: 1, updated: 0, skipped: 0 })
    const rows = expenseRows()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ date: '2026-07-26', site_id: 5, amount: 87000, type: 'telephony' })
  })

  it('aggregates multiple charges the same day and city into one row', async () => {
    await ingestGudokExpenses([
      charge({ amount: '-870,000' }),
      charge({ amount: '-500,000', text: 'Продление: Гудок-номер +7 844 111 22 33' }),
    ])
    const rows = expenseRows()
    expect(rows).toHaveLength(1)
    expect(rows[0].amount).toBe(137000)
  })

  it('is idempotent: re-posting the same days does not duplicate', async () => {
    const batch = [charge(), charge({ project: 'Ростов-На-Дону..', amount: '-500,000' })]
    const first = await ingestGudokExpenses(batch)
    expect(first).toEqual({ created: 2, updated: 0, skipped: 0 })
    const second = await ingestGudokExpenses(batch)
    expect(second).toEqual({ created: 0, updated: 0, skipped: 2 })
    expect(expenseRows()).toHaveLength(2)
  })

  it('replaces the stored amount when a re-collected day gains a charge', async () => {
    await ingestGudokExpenses([charge({ amount: '-870,000' })])
    const res = await ingestGudokExpenses([
      charge({ amount: '-870,000' }),
      charge({ amount: '-500,000', text: 'ещё номер' }),
    ])
    expect(res).toEqual({ created: 0, updated: 1, skipped: 0 })
    expect(expenseRows()[0].amount).toBe(137000)
  })

  it('resolves a truncated long city name by prefix', async () => {
    await ingestGudokExpenses([charge({ project: 'Ростов-На-Д..', amount: '-870,000' })])
    expect(expenseRows()[0].site_id).toBe(6)
  })

  it('stores unmatched projects as company-level (null site)', async () => {
    await ingestGudokExpenses([charge({ project: 'Неизвестный..', amount: '-870,000' })])
    expect(expenseRows()[0].site_id).toBeNull()
  })
})

describe('latestTelephonyDate', () => {
  it('returns null when empty and the max date otherwise', async () => {
    expect(await latestTelephonyDate()).toBeNull()
    await ingestGudokExpenses([charge({ date: '20.07.2026' }), charge({ date: '26.07.2026', project: 'Ростов-На-Дону..' })])
    expect(await latestTelephonyDate()).toBe('2026-07-26')
  })
})

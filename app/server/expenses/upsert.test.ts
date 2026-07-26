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

const { HOSTING_TYPE, upsertExpense } = await import('./upsert')

beforeAll(() => {
  applyMigrations()
})

beforeEach(() => {
  sqlite.exec('DELETE FROM expenses; DELETE FROM sites; DELETE FROM cities;')
  sqlite.exec(
    "INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES (1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES (5, 1, 'https://volgograd.example.com/', '111', 0, 0);",
  )
})

function expenseRows() {
  return sqlite.prepare('SELECT * FROM expenses ORDER BY date, site_id').all() as Record<string, unknown>[]
}

describe('upsertExpense', () => {
  it('inserts a new expense', async () => {
    const outcome = await upsertExpense({ date: '2026-01-01', siteId: 5, type: HOSTING_TYPE, amount: 500000 })
    expect(outcome).toBe('created')
    const rows = expenseRows()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ date: '2026-01-01', site_id: 5, amount: 500000, type: 'hosting' })
  })

  it('updates the amount when a row for (date, siteId, type) already exists', async () => {
    await upsertExpense({ date: '2026-01-01', siteId: 5, type: HOSTING_TYPE, amount: 500000 })
    const outcome = await upsertExpense({ date: '2026-01-01', siteId: 5, type: HOSTING_TYPE, amount: 750000 })
    expect(outcome).toBe('updated')
    const rows = expenseRows()
    expect(rows).toHaveLength(1)
    expect(rows[0].amount).toBe(750000)
  })

  it('is a no-op when the amount is unchanged', async () => {
    await upsertExpense({ date: '2026-01-01', siteId: 5, type: HOSTING_TYPE, amount: 500000 })
    const outcome = await upsertExpense({ date: '2026-01-01', siteId: 5, type: HOSTING_TYPE, amount: 500000 })
    expect(outcome).toBe('skipped')
    expect(expenseRows()).toHaveLength(1)
  })

  it('handles the company-wide null siteId branch independently of site rows', async () => {
    await upsertExpense({ date: '2026-01-01', siteId: null, type: HOSTING_TYPE, amount: 300000 })
    await upsertExpense({ date: '2026-01-01', siteId: 5, type: HOSTING_TYPE, amount: 500000 })
    const outcome = await upsertExpense({ date: '2026-01-01', siteId: null, type: HOSTING_TYPE, amount: 400000 })
    expect(outcome).toBe('updated')
    const rows = expenseRows()
    expect(rows).toHaveLength(2)
    const nullRow = rows.find(r => r.site_id === null)
    expect(nullRow?.amount).toBe(400000)
  })
})

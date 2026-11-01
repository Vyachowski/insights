import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { db, sqlite } from '@/server/db/client'

const { oldestEstimateDate, upsertExpense } = await import('./expenses')
const { HOSTING_TYPE } = await import('@/server/core/finance')
const { transaction } = await import('../transaction')

beforeEach(() => {
  sqlite.exec('DELETE FROM expenses; DELETE FROM sites; DELETE FROM cities;')
  sqlite.exec(
    "INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES (1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES (5, 1, 'https://volgograd.example.com/', '111', 0, 0);",
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

function expenseRows() {
  return sqlite.prepare('SELECT * FROM expenses ORDER BY date, site_id').all() as Record<string, unknown>[]
}

function seedEstimate(siteId: number | null = 5, date = '2026-01-01', type = 'telephony') {
  sqlite.prepare(
    'INSERT INTO expenses (date, site_id, amount, type, comment, is_estimate, created_at, updated_at) '
    + "VALUES (?, ?, 87000, ?, 'Оценка', 1, 0, 0)",
  ).run(date, siteId, type)
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

  it('writes the comment on create and overwrite', async () => {
    await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 100, comment: 'Гудок: 1' })
    expect(expenseRows()).toMatchObject([{ comment: 'Гудок: 1' }])

    await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 200, comment: 'Гудок: 2' })
    expect(expenseRows()).toMatchObject([{ amount: 200, comment: 'Гудок: 2' }])
  })

  it('keeps the stored comment when none is passed', async () => {
    await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 100, comment: 'Гудок: 1' })

    await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 200 })

    expect(expenseRows()).toMatchObject([{ amount: 200, comment: 'Гудок: 1' }])
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

  it.each([5, null])('overwrites the row when an insert race is lost, siteId %j', async siteId => {
    await upsertExpense({ date: '2026-01-01', siteId, type: HOSTING_TYPE, amount: 500000 })
    const noRowFound = { from: () => ({ where: () => ({ limit: () => ({ get: () => undefined }) }) }) }
    vi.spyOn(db, 'select').mockReturnValueOnce(noRowFound as never)

    const outcome = await upsertExpense({ date: '2026-01-01', siteId, type: HOSTING_TYPE, amount: 750000 })

    expect(outcome).toBe('updated')
    expect(expenseRows()).toMatchObject([{ site_id: siteId, type: 'hosting', amount: 750000 }])
  })
})

describe('upsertExpense over an estimate', () => {
  it('replaces the estimate at the same amount', async () => {
    seedEstimate()
    const outcome = await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 87000, comment: 'Гудок: 1' })
    expect(outcome).toBe('updated')
    expect(expenseRows()).toMatchObject([{ amount: 87000, comment: 'Гудок: 1', is_estimate: 0 }])
  })

  it('replaces the estimate at a different amount', async () => {
    seedEstimate()
    const outcome = await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 90000, comment: 'Гудок: 1' })
    expect(outcome).toBe('updated')
    expect(expenseRows()).toMatchObject([{ amount: 90000, comment: 'Гудок: 1', is_estimate: 0 }])
  })

  it('replaces a company-wide estimate', async () => {
    seedEstimate(null)
    const outcome = await upsertExpense({ date: '2026-01-01', siteId: null, type: 'telephony', amount: 87000 })
    expect(outcome).toBe('updated')
    expect(expenseRows()).toMatchObject([{ site_id: null, is_estimate: 0 }])
  })

  it('clears the estimate comment when none is passed, at the same amount', async () => {
    seedEstimate()
    await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 87000 })
    expect(expenseRows()).toMatchObject([{ amount: 87000, comment: null, is_estimate: 0 }])
  })

  it('clears the estimate comment when none is passed, at a different amount', async () => {
    seedEstimate()
    await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 90000 })
    expect(expenseRows()).toMatchObject([{ amount: 90000, comment: null, is_estimate: 0 }])
  })

  it('skips a repeated real write once the estimate is replaced', async () => {
    seedEstimate()
    const write = { date: '2026-01-01', siteId: 5, type: 'telephony', amount: 87000 }
    await upsertExpense(write)
    expect(await upsertExpense(write)).toBe('skipped')
    expect(expenseRows()).toMatchObject([{ is_estimate: 0 }])
  })

  it('clears the mark when an insert race meets an estimate', async () => {
    seedEstimate()
    const noRowFound = { from: () => ({ where: () => ({ limit: () => ({ get: () => undefined }) }) }) }
    vi.spyOn(db, 'select').mockReturnValueOnce(noRowFound as never)

    const outcome = await upsertExpense({ date: '2026-01-01', siteId: 5, type: 'telephony', amount: 87000 })

    expect(outcome).toBe('updated')
    expect(expenseRows()).toMatchObject([{ amount: 87000, comment: null, is_estimate: 0 }])
  })

  it('keeps an existing real row real', async () => {
    const write = { date: '2026-01-01', siteId: 5, type: 'telephony', amount: 87000 }
    await upsertExpense(write)

    expect(await upsertExpense(write)).toBe('skipped')
    expect(expenseRows()).toMatchObject([{ amount: 87000, is_estimate: 0 }])

    expect(await upsertExpense({ ...write, amount: 90000 })).toBe('updated')
    expect(expenseRows()).toMatchObject([{ amount: 90000, is_estimate: 0 }])
  })
})

describe('oldestEstimateDate', () => {
  const oldest = () => transaction(tx => oldestEstimateDate(tx, 'telephony'))

  it('is null with no estimates, whatever real rows exist', async () => {
    await upsertExpense({ date: '2025-12-01', siteId: 5, type: 'telephony', amount: 87000 })
    expect(oldest()).toBeNull()
  })

  it('returns the oldest estimate, not an older real row', async () => {
    await upsertExpense({ date: '2025-12-01', siteId: 5, type: 'telephony', amount: 87000 })
    seedEstimate(5, '2026-02-01')
    seedEstimate(5, '2026-01-01')
    expect(oldest()).toBe('2026-01-01')
  })

  it('skips estimates of another type', () => {
    seedEstimate(5, '2026-01-01', HOSTING_TYPE)
    expect(oldest()).toBeNull()
  })
})

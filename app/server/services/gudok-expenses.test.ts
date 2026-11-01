import { beforeEach, describe, expect, it } from 'vitest'

import { sqlite } from '@/server/db/client'

const { ingestGudokExpenses, telephonySince, writeGudokExpenses } = await import('./gudok-expenses')
const { GudokPayloadError } = await import('@/server/core/gudok-calls')
const { transaction } = await import('@/server/db/transaction')

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

describe('ingestGudokExpenses with estimates stored', () => {
  const seedEstimate = (date = '2026-07-20', type = 'telephony') => sqlite.prepare(
    'INSERT INTO expenses (date, site_id, amount, type, is_estimate, created_at, updated_at) VALUES (?, 5, 87000, ?, 1, 0, 0)',
  ).run(date, type)

  it('refuses the post and writes nothing, as a real charge on another date would add a second row', async () => {
    seedEstimate()
    const stored = expenseRows()
    await expect(ingestGudokExpenses([charge()])).rejects.toThrow(GudokPayloadError)
    expect(expenseRows()).toEqual(stored)
  })

  it('refuses an empty post too', async () => {
    seedEstimate()
    await expect(ingestGudokExpenses([])).rejects.toThrow(GudokPayloadError)
  })

  it('accepts the post when the estimates are of another type', async () => {
    seedEstimate('2026-07-20', 'hosting')
    expect(await ingestGudokExpenses([charge()])).toEqual({ created: 1, updated: 0, skipped: 0 })
  })
})

describe('writeGudokExpenses over an estimate', () => {
  const write = (rows: ReturnType<typeof charge>[]) =>
    transaction(tx => writeGudokExpenses(tx, rows, new Map([['волгоград', 5]])))
  const seedEstimate = () => sqlite.exec(
    'INSERT INTO expenses (date, site_id, amount, type, comment, is_estimate, created_at, updated_at) '
    + "VALUES ('2026-07-26', 5, 87000, 'telephony', 'Оценка', 1, 0, 0);",
  )
  const realComment = 'Гудок: Продление: Гудок-номер +7 844 260 69 54'

  it('replaces the estimate and its comment at the same amount', () => {
    seedEstimate()
    const result = write([charge()])
    expect(result).toEqual({ created: 0, updated: 1, skipped: 0 })
    expect(expenseRows()).toMatchObject([{ amount: 87000, comment: realComment, is_estimate: 0 }])
  })

  it('replaces the estimate and its comment at a different amount', () => {
    seedEstimate()
    const result = write([charge({ amount: '-900,000' })])
    expect(result).toEqual({ created: 0, updated: 1, skipped: 0 })
    expect(expenseRows()).toMatchObject([{ amount: 90000, comment: realComment, is_estimate: 0 }])
  })

  it('skips a repeated run once the estimate is replaced', () => {
    seedEstimate()
    write([charge()])
    const result = write([charge()])
    expect(result).toEqual({ created: 0, updated: 0, skipped: 1 })
    expect(expenseRows()).toMatchObject([{ is_estimate: 0 }])
  })
})

describe('telephonySince', () => {
  const seedEstimate = (date: string, type = 'telephony') => sqlite.prepare(
    'INSERT INTO expenses (date, site_id, amount, type, is_estimate, created_at, updated_at) VALUES (?, 5, 87000, ?, 1, 0, 0)',
  ).run(date, type)
  const seedTwoDays = () => ingestGudokExpenses([
    charge({ date: '20.07.2026' }),
    charge({ date: '26.07.2026', project: 'Ростов-На-Дону..' }),
  ])

  it('is null with nothing stored', () => {
    expect(telephonySince()).toBeNull()
  })

  it('returns the latest stored day with no estimates', async () => {
    await seedTwoDays()
    expect(telephonySince()).toBe('2026-07-26')
  })

  it('returns the oldest estimate, not the latest real day after it', async () => {
    await seedTwoDays()
    seedEstimate('2026-07-22')
    seedEstimate('2026-08-25')
    expect(telephonySince()).toBe('2026-07-22')
  })

  it('returns the oldest estimate when only estimates are stored', () => {
    seedEstimate('2026-08-25')
    expect(telephonySince()).toBe('2026-08-25')
  })

  it('ignores another expense type', async () => {
    await seedTwoDays()
    seedEstimate('2026-01-01', 'hosting')
    expect(telephonySince()).toBe('2026-07-26')
  })
})

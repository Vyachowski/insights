import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sqlite } from '@/server/db/client'

const { changeNumberCharge, listNumberCharges, writeDueEstimates } = await import('./auto-charges')
const { GudokPayloadError, receiveGudokPost, reconcileTelephony } = await import('./reconciliation')

const NOW = new Date('2026-11-01T09:00:00Z')
const PERIOD = { start: '2026-10-01', end: '2026-10-31' }

beforeEach(() => {
  vi.useFakeTimers({ now: NOW, toFake: ['Date'] })
  sqlite.exec(
    'DELETE FROM reconciliation_runs; DELETE FROM charge_schedules; DELETE FROM phone_numbers; '
    + 'DELETE FROM expenses; DELETE FROM sites; DELETE FROM cities;',
  )
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

afterEach(() => {
  vi.useRealTimers()
})

interface ScheduleSeed {
  id?: string
  siteId?: number | null
  enabled?: number
  nextDate?: string
  amount?: number
  noChargePeriodEnd?: string | null
}

function seedSchedule({
  id = '1',
  siteId = 5,
  enabled = 1,
  nextDate = '2026-11-23',
  amount = 87000,
  noChargePeriodEnd = null,
}: ScheduleSeed = {}) {
  sqlite.prepare(
    "INSERT INTO phone_numbers (provider, provider_number_id, site_id, created_at, updated_at) VALUES ('gudok', ?, ?, 0, 0)",
  ).run(id, siteId)
  sqlite.prepare(
    'INSERT INTO charge_schedules (provider, provider_number_id, enabled, next_date, amount, no_charge_period_end, created_at, updated_at) '
    + "VALUES ('gudok', ?, ?, ?, ?, ?, 0, 0)",
  ).run(id, enabled, nextDate, amount, noChargePeriodEnd)
}

function seedExpense(date: string, { siteId = 5 as number | null, amount = 87000, isEstimate = 0, type = 'telephony' } = {}) {
  sqlite.prepare(
    'INSERT INTO expenses (date, site_id, amount, type, is_estimate, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, 0)',
  ).run(date, siteId, amount, type, isEstimate)
}

const seedEstimate = (date: string, over: { siteId?: number | null, amount?: number, type?: string } = {}) =>
  seedExpense(date, { ...over, isEstimate: 1 })

const charge = (over: Record<string, unknown> = {}) => ({
  date: '24.10.2026',
  text: 'Продление: Гудок-номер +7 844 260 69 54',
  project: 'Волгоград..',
  kind: 'Списание',
  amount: '-870,000 i',
  ...over,
})

function expenseRows() {
  return sqlite.prepare('SELECT date, site_id, amount, type, is_estimate FROM expenses ORDER BY date, site_id').all()
}

interface ScheduleRow { next_date: string, amount: number, enabled: number, no_charge_period_end: string | null }

const scheduleOf = (id = '1') => sqlite.prepare(
  'SELECT next_date, amount, enabled, no_charge_period_end FROM charge_schedules WHERE provider_number_id = ?',
).get(id) as ScheduleRow

const runs = () => sqlite.prepare('SELECT period_start, period_end, ran_at FROM reconciliation_runs').all()

describe('reconcileTelephony', () => {
  it('deletes estimates inside the period, both ends included, and keeps the rest', async () => {
    seedEstimate('2026-09-30')
    seedEstimate('2026-10-01')
    seedEstimate('2026-10-15', { siteId: 6 })
    seedEstimate('2026-10-31')
    seedEstimate('2026-11-01')
    seedEstimate('2026-10-10', { type: 'hosting' })
    seedExpense('2026-10-20')

    const result = await reconcileTelephony([], PERIOD)

    expect(result).toEqual({ created: 0, updated: 0, skipped: 0, deletedEstimates: 3 })
    expect(expenseRows()).toEqual([
      expect.objectContaining({ date: '2026-09-30', is_estimate: 1 }),
      expect.objectContaining({ date: '2026-10-10', type: 'hosting', is_estimate: 1 }),
      expect.objectContaining({ date: '2026-10-20', is_estimate: 0 }),
      expect.objectContaining({ date: '2026-11-01', is_estimate: 1 }),
    ])
  })

  it('swaps an estimate for a real charge on the same date', async () => {
    seedEstimate('2026-10-24')

    const result = await reconcileTelephony([charge()], PERIOD)

    expect(result).toEqual({ created: 1, updated: 0, skipped: 0, deletedEstimates: 1 })
    expect(expenseRows()).toEqual([expect.objectContaining({ date: '2026-10-24', is_estimate: 0 })])
  })

  it('adds no second row for a real charge on another date', async () => {
    seedSchedule()
    seedEstimate('2026-10-24')

    await reconcileTelephony([charge({ date: '26.10.2026' })], PERIOD)

    expect(expenseRows()).toEqual([expect.objectContaining({ date: '2026-10-26', is_estimate: 0 })])
    expect(scheduleOf().next_date).toBe('2026-11-25')
  })

  it('counts the stored real rows it leaves alone or changes', async () => {
    seedExpense('2026-10-24')
    seedExpense('2026-10-25', { siteId: 6 })

    const result = await reconcileTelephony([
      charge(),
      charge({ date: '25.10.2026', project: 'Ростов-На-Дону..', amount: '-900,000' }),
      charge({ date: '26.10.2026' }),
    ], PERIOD)

    expect(result).toEqual({ created: 1, updated: 1, skipped: 1, deletedEstimates: 0 })
  })

  it('takes a tariff change from the last real charge', async () => {
    seedSchedule()
    seedEstimate('2026-10-24')

    await reconcileTelephony([charge({ amount: '-990,000 i' })], PERIOD)

    expect(scheduleOf()).toMatchObject({ next_date: '2026-11-23', amount: 99000 })
    expect(scheduleOf().no_charge_period_end).toBeNull()
  })

  it('leaves the next date and amount of a site with no real charge at all', async () => {
    seedSchedule({ nextDate: '2026-11-23', amount: 50000 })
    seedExpense('2026-10-24', { siteId: 6, amount: 90000 })

    await reconcileTelephony([], PERIOD)

    expect(scheduleOf()).toMatchObject({ next_date: '2026-11-23', amount: 50000 })
  })

  it('ignores an estimate left past the period when it finds the last real charge', async () => {
    seedSchedule()
    seedExpense('2026-10-24')
    seedEstimate('2026-11-01', { amount: 50000 })

    await reconcileTelephony([], PERIOD)

    expect(scheduleOf()).toMatchObject({ next_date: '2026-11-23', amount: 87000 })
  })

  it('reads the last real charge from stored rows when the period holds none', async () => {
    seedSchedule()
    seedExpense('2026-08-25', { amount: 87000 })
    seedExpense('2026-07-26', { amount: 48000 })

    await reconcileTelephony([], PERIOD)

    expect(scheduleOf()).toMatchObject({ next_date: '2026-09-24', amount: 87000 })
  })

  it('keeps a number on after a run with no real charge, and the hourly job writes estimates again', async () => {
    seedSchedule({ nextDate: '2026-11-23' })
    seedExpense('2026-08-25')
    seedEstimate('2026-09-24')
    seedEstimate('2026-10-24')

    await reconcileTelephony([], PERIOD)

    expect(scheduleOf()).toMatchObject({ enabled: 1, next_date: '2026-09-24', no_charge_period_end: '2026-10-31' })
    expect(expenseRows()).toEqual([
      expect.objectContaining({ date: '2026-08-25', is_estimate: 0 }),
      expect.objectContaining({ date: '2026-09-24', is_estimate: 1 }),
    ])

    expect(writeDueEstimates().written).toBe(1)
    expect(expenseRows()).toEqual([
      expect.objectContaining({ date: '2026-08-25', is_estimate: 0 }),
      expect.objectContaining({ date: '2026-09-24', is_estimate: 1 }),
      expect.objectContaining({ date: '2026-10-24', is_estimate: 1 }),
    ])
    expect(scheduleOf().next_date).toBe('2026-11-23')
  })

  it('sets nothing on a short period with no charge due', async () => {
    seedSchedule()
    seedExpense('2026-10-24')

    await reconcileTelephony([], { start: '2026-10-25', end: '2026-10-28' })

    expect(scheduleOf().no_charge_period_end).toBeNull()
  })

  it('clears a stored value after a short period with no charge due', async () => {
    seedSchedule({ noChargePeriodEnd: '2026-09-30' })

    await reconcileTelephony([], { start: '2026-10-25', end: '2026-10-28' })

    expect(scheduleOf().no_charge_period_end).toBeNull()
  })

  it('clears a stored value after a real charge', async () => {
    seedSchedule({ noChargePeriodEnd: '2026-09-30' })
    seedEstimate('2026-10-24')

    await reconcileTelephony([charge()], PERIOD)

    expect(scheduleOf().no_charge_period_end).toBeNull()
  })

  it('counts a real row already stored in the period as a charge', async () => {
    seedSchedule()
    seedEstimate('2026-10-24')
    seedExpense('2026-10-26')

    await reconcileTelephony([], PERIOD)

    expect(scheduleOf().no_charge_period_end).toBeNull()
  })

  it('does not count a real charge past the period as a charge in it', async () => {
    seedSchedule()
    seedEstimate('2026-10-24')
    seedExpense('2026-11-01')

    await reconcileTelephony([], PERIOD)

    expect(scheduleOf().no_charge_period_end).toBe('2026-10-31')
  })

  it('does not change a disabled schedule', async () => {
    seedSchedule({ enabled: 0, nextDate: '2026-11-23', amount: 50000, noChargePeriodEnd: '2026-09-30' })
    seedEstimate('2026-10-24')

    await reconcileTelephony([charge({ date: '26.10.2026', amount: '-990,000' })], PERIOD)

    expect(scheduleOf()).toMatchObject({
      enabled: 0,
      next_date: '2026-11-23',
      amount: 50000,
      no_charge_period_end: '2026-09-30',
    })
  })

  it('keeps the values of a number with no site and clears its stored value', async () => {
    seedSchedule({ siteId: null, nextDate: '2026-11-23', amount: 50000, noChargePeriodEnd: '2026-09-30' })
    seedEstimate('2026-10-24', { siteId: null })

    await reconcileTelephony([charge({ project: 'Неизвестный..' })], PERIOD)

    expect(scheduleOf()).toMatchObject({ next_date: '2026-11-23', amount: 50000, no_charge_period_end: null })
  })

  it('records the run, also when no charge came', async () => {
    await reconcileTelephony([], PERIOD)

    expect(runs()).toEqual([{ period_start: '2026-10-01', period_end: '2026-10-31', ran_at: NOW.getTime() }])
  })

  it('is safe to repeat', async () => {
    seedSchedule()
    seedEstimate('2026-10-24')
    await reconcileTelephony([charge()], PERIOD)
    const stored = expenseRows()

    const result = await reconcileTelephony([charge()], PERIOD)

    expect(result).toEqual({ created: 0, updated: 0, skipped: 1, deletedEstimates: 0 })
    expect(expenseRows()).toEqual(stored)
    expect(scheduleOf().next_date).toBe('2026-11-23')
  })

  it('changes nothing when the last step fails', async () => {
    seedSchedule({ nextDate: '2026-11-23', noChargePeriodEnd: '2026-09-30' })
    seedEstimate('2026-10-24')
    const stored = expenseRows()
    const schedule = scheduleOf()
    sqlite.exec(
      "CREATE TRIGGER fail_run BEFORE INSERT ON reconciliation_runs BEGIN SELECT RAISE(ABORT, 'disk full'); END;",
    )

    try {
      await expect(reconcileTelephony([charge({ date: '26.10.2026' })], PERIOD)).rejects.toThrow('disk full')
      expect(expenseRows()).toEqual(stored)
      expect(scheduleOf()).toEqual(schedule)
      expect(runs()).toEqual([])
    } finally {
      sqlite.exec('DROP TRIGGER fail_run')
    }
  })
})

describe('no-charge mark', () => {
  const markOf = async () => (await listNumberCharges())[0]

  beforeEach(() => {
    seedSchedule({ nextDate: '2026-09-24' })
    seedExpense('2026-08-25')
    seedEstimate('2026-09-24')
    seedEstimate('2026-10-24')
  })

  it('is set by a run with no real charge, and the number stays on', async () => {
    await reconcileTelephony([], PERIOD)

    expect(await markOf()).toMatchObject({ enabled: true, noChargePeriodEnd: '2026-10-31' })
  })

  it('is cleared by the next run with a real charge', async () => {
    await reconcileTelephony([], PERIOD)

    await reconcileTelephony([charge()], PERIOD)

    expect(await markOf()).toMatchObject({ enabled: true, noChargePeriodEnd: null })
  })

  it('is cleared by switching the number off', async () => {
    await reconcileTelephony([], PERIOD)

    changeNumberCharge({ intent: 'switch-off', provider: 'gudok', providerNumberId: '1' })

    expect(await markOf()).toMatchObject({ enabled: false, noChargePeriodEnd: null })
    expect(scheduleOf().no_charge_period_end).toBeNull()
  })
})

describe('receiveGudokPost', () => {
  it('runs reconciliation on a valid period and returns its counts', async () => {
    seedEstimate('2026-10-24')

    const result = await receiveGudokPost([charge({ date: '26.10.2026' })], PERIOD)

    expect(result).toEqual({ created: 1, updated: 0, skipped: 0, deletedEstimates: 1 })
    expect(expenseRows()).toEqual([expect.objectContaining({ date: '2026-10-26', is_estimate: 0 })])
    expect(runs()).toMatchObject([{ period_start: '2026-10-01', period_end: '2026-10-31' }])
  })

  it('accepts an empty list with a valid period, so a run with no charges still reconciles', async () => {
    seedEstimate('2026-10-24')

    const result = await receiveGudokPost([], PERIOD)

    expect(result).toEqual({ created: 0, updated: 0, skipped: 0, deletedEstimates: 1 })
    expect(expenseRows()).toEqual([])
    expect(runs()).toHaveLength(1)
  })

  it.each([
    ['a day that does not exist', { start: '2026-02-31', end: '2026-10-31' }],
    ['a start after its end', { start: '2026-10-31', end: '2026-10-01' }],
    ['null', null],
  ])('refuses %s and writes nothing', async (_, period) => {
    seedEstimate('2026-10-24')
    const stored = expenseRows()

    await expect(receiveGudokPost([charge()], period)).rejects.toThrow(GudokPayloadError)

    expect(expenseRows()).toEqual(stored)
    expect(runs()).toEqual([])
  })

  it('refuses a bad period with no estimates stored, not falling back to the ingest', async () => {
    await expect(receiveGudokPost([charge()], { start: 'x', end: 'y' })).rejects.toThrow(GudokPayloadError)
    expect(expenseRows()).toEqual([])
  })

  it('refuses a post with no period while estimates exist and writes nothing', async () => {
    seedEstimate('2026-10-24')
    const stored = expenseRows()

    await expect(receiveGudokPost([charge({ date: '26.10.2026' })], undefined)).rejects.toThrow(GudokPayloadError)

    expect(expenseRows()).toEqual(stored)
    expect(runs()).toEqual([])
  })

  it('keeps the ingest for a post with no period and no estimates', async () => {
    const result = await receiveGudokPost([charge()], undefined)

    expect(result).toEqual({ created: 1, updated: 0, skipped: 0 })
    expect(expenseRows()).toEqual([expect.objectContaining({ date: '2026-10-24', is_estimate: 0 })])
    expect(runs()).toEqual([])
  })
})

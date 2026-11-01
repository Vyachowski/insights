import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sqlite } from '@/server/db/client'

const { listNumberCharges, writeDueEstimates } = await import('./auto-charges')

const NOW = new Date('2026-10-29T09:00:00Z')

beforeEach(() => {
  vi.useFakeTimers({ now: NOW, toFake: ['Date'] })
  sqlite.exec(
    'DELETE FROM charge_schedules; DELETE FROM phone_numbers; DELETE FROM expenses; DELETE FROM sites; DELETE FROM cities;',
  )
  sqlite.exec(
    "INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES (1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES (5, 1, 'https://volgograd.example.com/', '111', 0, 0);",
  )
})

afterEach(() => {
  vi.useRealTimers()
})

function seedSchedule({ enabled = 1, nextDate = '2026-10-29', amount = 87000, siteId = 5 as number | null } = {}) {
  sqlite.prepare(
    "INSERT INTO phone_numbers (provider, provider_number_id, site_id, created_at, updated_at) VALUES ('gudok', '1', ?, 0, 0)",
  ).run(siteId)
  sqlite.prepare(
    'INSERT INTO charge_schedules (provider, provider_number_id, enabled, next_date, amount, created_at, updated_at) '
    + "VALUES ('gudok', '1', ?, ?, ?, 0, 0)",
  ).run(enabled, nextDate, amount)
}

function expenseRows() {
  return sqlite.prepare('SELECT * FROM expenses ORDER BY date').all() as Record<string, unknown>[]
}

const nextDate = () => (sqlite.prepare('SELECT next_date FROM charge_schedules').get() as { next_date: string }).next_date

describe('writeDueEstimates', () => {
  it('writes an estimate on the due date and moves the next date', () => {
    seedSchedule()

    expect(writeDueEstimates()).toEqual({ checked: 1, written: 1 })

    expect(expenseRows()).toMatchObject([{
      date: '2026-10-29',
      site_id: 5,
      amount: 87000,
      type: 'telephony',
      comment: null,
      is_estimate: 1,
    }])
    expect(nextDate()).toBe('2026-11-28')
  })

  it('writes nothing before the due date', () => {
    seedSchedule({ nextDate: '2026-10-30' })

    expect(writeDueEstimates()).toEqual({ checked: 1, written: 0 })

    expect(expenseRows()).toEqual([])
    expect(nextDate()).toBe('2026-10-30')
  })

  it('takes today from the Moscow day', () => {
    seedSchedule({ nextDate: '2026-10-30' })

    vi.setSystemTime('2026-10-29T20:59:59Z')
    expect(writeDueEstimates().written).toBe(0)

    vi.setSystemTime('2026-10-29T21:00:00Z')
    expect(writeDueEstimates().written).toBe(1)
  })

  it('catches up every date missed in downtime', () => {
    seedSchedule({ nextDate: '2026-08-30' })

    expect(writeDueEstimates()).toEqual({ checked: 1, written: 3 })

    expect(expenseRows().map(row => row.date)).toEqual(['2026-08-30', '2026-09-29', '2026-10-29'])
    expect(nextDate()).toBe('2026-11-28')
  })

  it('adds nothing on a repeated run', () => {
    seedSchedule({ nextDate: '2026-08-30' })
    writeDueEstimates()
    const before = expenseRows()

    expect(writeDueEstimates()).toEqual({ checked: 1, written: 0 })

    expect(expenseRows()).toEqual(before)
    expect(nextDate()).toBe('2026-11-28')
  })

  it('leaves a real row on a due date unchanged and writes the other dates', () => {
    seedSchedule({ nextDate: '2026-09-29' })
    sqlite.exec(
      'INSERT INTO expenses (date, site_id, amount, type, comment, created_at, updated_at) '
      + "VALUES ('2026-09-29', 5, 90000, 'telephony', 'Гудок: 1', 1, 1);",
    )
    const [realRow] = expenseRows()

    expect(writeDueEstimates()).toEqual({ checked: 1, written: 1 })

    expect(expenseRows()).toEqual([realRow, expect.objectContaining({ date: '2026-10-29', is_estimate: 1 })])
    expect(nextDate()).toBe('2026-11-28')
  })

  it('leaves another expense type on the same day alone', () => {
    seedSchedule()
    sqlite.exec(
      'INSERT INTO expenses (date, site_id, amount, type, created_at, updated_at) '
      + "VALUES ('2026-10-29', 5, 500000, 'hosting', 0, 0);",
    )

    expect(writeDueEstimates().written).toBe(1)

    expect(expenseRows().map(row => row.type).sort()).toEqual(['hosting', 'telephony'])
  })

  it('skips a disabled schedule', () => {
    seedSchedule({ enabled: 0 })

    expect(writeDueEstimates()).toEqual({ checked: 0, written: 0 })

    expect(expenseRows()).toEqual([])
    expect(nextDate()).toBe('2026-10-29')
  })

  it('skips a number with no site, and catches up once it has one', () => {
    seedSchedule({ siteId: null, nextDate: '2026-09-29' })

    expect(writeDueEstimates()).toEqual({ checked: 0, written: 0 })
    expect(expenseRows()).toEqual([])
    expect(nextDate()).toBe('2026-09-29')

    sqlite.exec('UPDATE phone_numbers SET site_id = 5')

    expect(writeDueEstimates()).toEqual({ checked: 1, written: 2 })
  })

  it('writes nothing when any date of the check fails', () => {
    seedSchedule({ nextDate: '2026-09-29' })
    sqlite.exec(
      'CREATE TRIGGER fail_second_date BEFORE INSERT ON expenses WHEN NEW.date = \'2026-10-29\' '
      + "BEGIN SELECT RAISE(ABORT, 'disk full'); END;",
    )

    try {
      expect(() => writeDueEstimates()).toThrow('disk full')
      expect(expenseRows()).toEqual([])
      expect(nextDate()).toBe('2026-09-29')
    } finally {
      sqlite.exec('DROP TRIGGER fail_second_date')
    }
  })
})

describe('listNumberCharges', () => {
  it('gives each number its site and auto charge, in rubles', async () => {
    seedSchedule({ nextDate: '2026-11-26', amount: 87000 })

    expect(await listNumberCharges()).toMatchObject([
      { providerNumberId: '1', siteId: 5, enabled: true, nextDate: '2026-11-26', amount: 870 },
    ])
  })
})

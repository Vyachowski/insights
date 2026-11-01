import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sqlite } from '@/server/db/client'

const { changeNumberCharge, listNumberCharges, writeDueEstimates } = await import('./auto-charges')

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
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES (5, 1, 'https://volgograd.example.com/', '111', 0, 0), (6, 1, 'https://volzhsky.example.com/', '222', 0, 0);",
  )
})

afterEach(() => {
  vi.useRealTimers()
})

function seedNumber(id: string, siteId: number | null) {
  sqlite.prepare(
    "INSERT INTO phone_numbers (provider, provider_number_id, site_id, created_at, updated_at) VALUES ('gudok', ?, ?, 0, 0)",
  ).run(id, siteId)
}

function seedExpense(date: string, amount: number, { type = 'telephony', isEstimate = 0 } = {}) {
  sqlite.prepare(
    'INSERT INTO expenses (date, site_id, amount, type, is_estimate, created_at, updated_at) VALUES (?, 5, ?, ?, ?, 0, 0)',
  ).run(date, amount, type, isEstimate)
}

function seedSchedule({ enabled = 1, nextDate = '2026-10-29', amount = 87000, siteId = 5 as number | null } = {}) {
  seedNumber('1', siteId)
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

  it('offers the last real charge of the site, not an estimate or another type', async () => {
    seedSchedule({ enabled: 0, nextDate: '2026-01-01', amount: 30000 })
    seedExpense('2026-09-27', 80000)
    seedExpense('2026-10-27', 87000)
    seedExpense('2026-11-26', 87000, { isEstimate: 1 })
    seedExpense('2026-10-28', 500000, { type: 'hosting' })

    expect(await listNumberCharges()).toMatchObject([
      { enabled: false, nextDate: null, amount: null, offer: { nextDate: '2026-11-26', amount: 870 } },
    ])
  })

  it('offers nothing for a site with no real charge', async () => {
    seedSchedule({ enabled: 0 })
    seedExpense('2026-10-27', 87000, { isEstimate: 1 })

    expect(await listNumberCharges()).toMatchObject([{ offer: null }])
  })

  it('offers nothing for a number with no site', async () => {
    seedNumber('1', null)
    seedExpense('2026-10-27', 87000)

    expect(await listNumberCharges()).toMatchObject([{ offer: null }])
  })
})

describe('changeNumberCharge', () => {
  const save = (form: Record<string, string> = {}) => changeNumberCharge({
    intent: 'save',
    provider: 'gudok',
    providerNumberId: '1',
    nextDate: '2026-11-26',
    amount: '870',
    ...form,
  })
  const switchOff = (providerNumberId = '1') => changeNumberCharge({ intent: 'switch-off', provider: 'gudok', providerNumberId })
  const schedules = () => sqlite.prepare('SELECT * FROM charge_schedules ORDER BY provider_number_id').all()

  it('switches a number on, storing a real date, kopecks and the default interval', () => {
    seedNumber('1', 5)

    expect(save()).toEqual({ ok: true, outcome: 'on' })

    expect(schedules()).toMatchObject([{ enabled: 1, next_date: '2026-11-26', amount: 87000, interval_days: 30 }])
  })

  it('edits the date and amount of a number that is on', () => {
    seedSchedule()

    expect(save({ nextDate: '2026-12-01', amount: '900.50' })).toEqual({ ok: true, outcome: 'updated' })

    expect(schedules()).toMatchObject([{ enabled: 1, next_date: '2026-12-01', amount: 90050 }])
  })

  it('switches off, keeps written rows and stops new estimates', () => {
    seedSchedule()
    writeDueEstimates()

    expect(switchOff()).toEqual({ ok: true, outcome: 'off' })

    expect(schedules()).toMatchObject([{ enabled: 0 }])
    expect(expenseRows()).toMatchObject([{ date: '2026-10-29', is_estimate: 1 }])

    vi.setSystemTime('2026-12-29T09:00:00Z')
    expect(writeDueEstimates()).toEqual({ checked: 0, written: 0 })
    expect(expenseRows()).toHaveLength(1)
  })

  it('switches on again with the new values, in one row', () => {
    seedSchedule({ nextDate: '2026-01-01', amount: 30000 })
    switchOff()

    expect(save()).toEqual({ ok: true, outcome: 'on' })

    expect(schedules()).toMatchObject([{ enabled: 1, next_date: '2026-11-26', amount: 87000 }])
  })

  it('offers fresh values after off, with stored ones left behind', async () => {
    seedSchedule({ nextDate: '2026-01-01', amount: 30000 })
    switchOff()
    seedExpense('2026-10-27', 90000)

    expect(await listNumberCharges()).toMatchObject([{ offer: { nextDate: '2026-11-26', amount: 900 } }])
  })

  it('clears an old no-charge mark on switching on, and keeps it on an edit', () => {
    seedSchedule({ enabled: 0 })
    sqlite.exec("UPDATE charge_schedules SET no_charge_period_end = '2026-10-31'")

    save()
    expect(schedules()).toMatchObject([{ no_charge_period_end: null }])

    sqlite.exec("UPDATE charge_schedules SET no_charge_period_end = '2026-10-31'")
    save({ amount: '900' })
    expect(schedules()).toMatchObject([{ no_charge_period_end: '2026-10-31' }])
  })

  it('clears the no-charge mark on switching off, and keeps the date and amount', () => {
    seedSchedule({ nextDate: '2026-11-26' })
    sqlite.exec("UPDATE charge_schedules SET no_charge_period_end = '2026-10-31'")

    switchOff()

    expect(schedules()).toMatchObject([{
      enabled: 0,
      next_date: '2026-11-26',
      amount: 87000,
      no_charge_period_end: null,
    }])
  })

  it('refuses a second enabled number on a site and writes nothing', () => {
    seedSchedule()
    seedNumber('2', 5)

    expect(save({ providerNumberId: '2' })).toEqual({ error: 'На этом сайте уже включён другой номер' })

    expect(schedules()).toHaveLength(1)
  })

  it('refuses a second number that already has a schedule', () => {
    seedSchedule()
    seedNumber('2', 5)
    sqlite.exec(
      'INSERT INTO charge_schedules (provider, provider_number_id, enabled, next_date, amount, created_at, updated_at) '
      + "VALUES ('gudok', '2', 0, '2026-01-01', 30000, 0, 0)",
    )

    expect(save({ providerNumberId: '2' })).toHaveProperty('error')

    expect(schedules()).toMatchObject([{ enabled: 1 }, { enabled: 0, next_date: '2026-01-01' }])
  })

  it('allows a second number once the first is off', () => {
    seedSchedule()
    seedNumber('2', 5)
    switchOff()

    expect(save({ providerNumberId: '2' })).toEqual({ ok: true, outcome: 'on' })
  })

  it('counts a disabled number and a number on another site as free', () => {
    seedSchedule({ enabled: 0 })
    seedNumber('2', 6)
    seedNumber('3', 5)

    expect(save({ providerNumberId: '2' })).toEqual({ ok: true, outcome: 'on' })
    expect(save({ providerNumberId: '3' })).toEqual({ ok: true, outcome: 'on' })
  })

  it('refuses a number with no site', () => {
    seedNumber('1', null)

    expect(save()).toEqual({ error: 'Номер без сайта нельзя включить' })

    expect(schedules()).toEqual([])
  })

  it('refuses an unknown number', () => {
    expect(save()).toEqual({ error: 'Номер не найден' })
  })

  it.each([
    [{ nextDate: '2026-02-30' }, 'Укажите дату'],
    [{ nextDate: 'tomorrow' }, 'Укажите дату'],
    [{ amount: '0' }, 'Укажите сумму больше нуля'],
    [{ amount: '-1' }, 'Укажите сумму больше нуля'],
  ])('refuses %j and leaves the schedule as it was', (form, error) => {
    seedSchedule()

    expect(save(form)).toEqual({ error })

    expect(schedules()).toMatchObject([{ next_date: '2026-10-29', amount: 87000 }])
  })

  it('ignores an interval sent in the form', () => {
    seedNumber('1', 5)

    save({ intervalDays: '0' })

    expect(schedules()).toMatchObject([{ interval_days: 30 }])
  })

  it.each([0, -30])('refuses to switch on a stored interval of %d, so no check can fail on it', intervalDays => {
    seedSchedule({ enabled: 0 })
    sqlite.prepare('UPDATE charge_schedules SET interval_days = ?').run(intervalDays)

    expect(save()).toEqual({ error: 'Некорректный интервал списания' })

    expect(schedules()).toMatchObject([{ enabled: 0 }])
    expect(writeDueEstimates()).toEqual({ checked: 0, written: 0 })
  })

  it('still switches off a schedule with a bad interval, so the job recovers', () => {
    seedSchedule()
    sqlite.exec('UPDATE charge_schedules SET interval_days = 0')
    expect(() => writeDueEstimates()).toThrow(RangeError)

    expect(switchOff()).toEqual({ ok: true, outcome: 'off' })

    expect(writeDueEstimates()).toEqual({ checked: 0, written: 0 })
  })

  it('reports off for a number with no schedule and creates none', () => {
    seedNumber('1', 5)

    expect(switchOff()).toEqual({ ok: true, outcome: 'off' })

    expect(schedules()).toEqual([])
  })

  it('refuses an unknown intent', () => {
    expect(changeNumberCharge({ intent: 'other' })).toEqual({ error: 'Неизвестное действие' })
  })
})

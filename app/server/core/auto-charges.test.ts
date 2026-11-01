import { afterEach, describe, expect, it } from 'vitest'

import {
  chargesDue,
  hostingCharge,
  isReconciliationStale,
  isValidInterval,
  moscowDay,
  numberCharge,
  parseScheduleForm,
  reconciledSchedule,
} from './auto-charges'

describe('moscowDay', () => {
  it('turns over at midnight in Moscow, not in UTC', () => {
    expect(moscowDay(new Date('2026-10-31T20:59:59Z'))).toBe('2026-10-31')
    expect(moscowDay(new Date('2026-10-31T21:00:00Z'))).toBe('2026-11-01')
  })
})

describe('chargesDue', () => {
  const schedule = { nextDate: '2026-10-29', intervalDays: 30 }

  it('owes nothing before the next date', () => {
    expect(chargesDue(schedule, '2026-10-28')).toEqual({ dates: [], nextDate: '2026-10-29' })
  })

  it('owes the charge on the next date, and moves it past today', () => {
    expect(chargesDue(schedule, '2026-10-29')).toEqual({ dates: ['2026-10-29'], nextDate: '2026-11-28' })
  })

  it('owes every date missed in downtime', () => {
    expect(chargesDue(schedule, '2027-01-01')).toEqual({
      dates: ['2026-10-29', '2026-11-28', '2026-12-28'],
      nextDate: '2027-01-27',
    })
  })

  it('counts a leap day', () => {
    expect(chargesDue({ nextDate: '2028-02-15', intervalDays: 30 }, '2028-02-15').nextDate).toBe('2028-03-16')
  })

  it('refuses an interval that would never pass today', () => {
    expect(() => chargesDue({ ...schedule, intervalDays: 0 }, '2026-10-29')).toThrow(RangeError)
  })
})

describe('chargesDue by calendar months', () => {
  const yearly = (nextDate: string) => ({ nextDate, intervalMonths: 12 })

  it('owes each year on the same calendar date, across a leap year', () => {
    expect(chargesDue(yearly('2027-03-15'), '2029-03-15')).toEqual({
      dates: ['2027-03-15', '2028-03-15', '2029-03-15'],
      nextDate: '2030-03-15',
    })
  })

  it('falls from 29.02 on 28.02, where the date then stays', () => {
    expect(chargesDue(yearly('2024-02-29'), '2028-03-01')).toEqual({
      dates: ['2024-02-29', '2025-02-28', '2026-02-28', '2027-02-28', '2028-02-28'],
      nextDate: '2029-02-28',
    })
  })

  it('takes the last day of a shorter month', () => {
    expect(chargesDue({ nextDate: '2026-01-31', intervalMonths: 1 }, '2026-01-31').nextDate).toBe('2026-02-28')
  })

  it('refuses an interval that would never pass today', () => {
    expect(() => chargesDue({ nextDate: '2026-10-29', intervalMonths: 0 }, '2026-10-29')).toThrow(RangeError)
  })
})

describe('isReconciliationStale', () => {
  const today = '2026-11-01'
  const estimates = { hasEstimates: true, today }

  it('allows exactly 90 days and flags 91', () => {
    expect(isReconciliationStale({ lastRunEnd: '2026-08-03', lastRealDay: null }, estimates)).toBe(false)
    expect(isReconciliationStale({ lastRunEnd: '2026-08-02', lastRealDay: null }, estimates)).toBe(true)
  })

  it('counts from the last run even when the last real day is older or newer', () => {
    expect(isReconciliationStale({ lastRunEnd: '2026-10-01', lastRealDay: '2026-01-01' }, estimates)).toBe(false)
    expect(isReconciliationStale({ lastRunEnd: '2026-01-01', lastRealDay: '2026-10-01' }, estimates)).toBe(true)
  })

  it('falls back to the last real day with no recorded run', () => {
    expect(isReconciliationStale({ lastRunEnd: null, lastRealDay: '2026-08-03' }, estimates)).toBe(false)
    expect(isReconciliationStale({ lastRunEnd: null, lastRealDay: '2026-08-02' }, estimates)).toBe(true)
  })

  it('has nothing to check with no estimates', () => {
    expect(isReconciliationStale({ lastRunEnd: '2026-01-01', lastRealDay: null }, { hasEstimates: false, today })).toBe(false)
  })

  it('has no age to measure with neither date', () => {
    expect(isReconciliationStale({ lastRunEnd: null, lastRealDay: null }, estimates)).toBe(false)
  })
})

describe('reconciledSchedule', () => {
  const schedule = { nextDate: '2026-10-29', amount: 87000, intervalDays: 30, noChargePeriodEnd: null }
  const run = { estimated: false, charged: false, periodEnd: '2026-10-31' }
  const lastCharge = { date: '2026-10-27', amount: 90000 }

  it('takes the next date and amount from the last real charge', () => {
    expect(reconciledSchedule(schedule, { ...run, lastCharge })).toMatchObject({
      nextDate: '2026-11-26',
      amount: 90000,
    })
  })

  it('steps by the interval of the schedule', () => {
    expect(reconciledSchedule({ ...schedule, intervalDays: 7 }, { ...run, lastCharge }).nextDate).toBe('2026-11-03')
  })

  it('keeps its values with no real charge at all', () => {
    expect(reconciledSchedule(schedule, run)).toMatchObject({ nextDate: '2026-10-29', amount: 87000 })
  })

  it.each([
    { estimated: true, charged: false, noChargePeriodEnd: '2026-10-31' },
    { estimated: true, charged: true, noChargePeriodEnd: null },
    { estimated: false, charged: true, noChargePeriodEnd: null },
    { estimated: false, charged: false, noChargePeriodEnd: '2026-09-30' },
  ])('with estimated $estimated and charged $charged stores $noChargePeriodEnd', ({ noChargePeriodEnd, ...flags }) => {
    const marked = { ...schedule, noChargePeriodEnd: '2026-09-30' }

    expect(reconciledSchedule(marked, { ...run, ...flags }).noChargePeriodEnd).toBe(noChargePeriodEnd)
  })
})

describe('numberCharge', () => {
  const noSchedule = { enabled: null, nextDate: null, amount: null, noChargePeriodEnd: null }

  it('gives an enabled number its next date and amount in rubles', () => {
    expect(numberCharge({ ...noSchedule, enabled: true, nextDate: '2026-11-26', amount: 87050 }))
      .toEqual({ enabled: true, nextDate: '2026-11-26', amount: 870.5, noChargePeriodEnd: null, offer: null })
  })

  it('shows a number with no schedule as off', () => {
    expect(numberCharge(noSchedule))
      .toEqual({ enabled: false, nextDate: null, amount: null, noChargePeriodEnd: null, offer: null })
  })

  it('hides the stored values of a schedule that is off', () => {
    const stored = { enabled: false, nextDate: '2026-11-26', amount: 87000, noChargePeriodEnd: '2026-10-31' }

    expect(numberCharge(stored))
      .toEqual({ enabled: false, nextDate: null, amount: null, noChargePeriodEnd: null, offer: null })
  })

  it('gives an enabled number its no-charge mark', () => {
    const stored = { enabled: true, nextDate: '2026-09-24', amount: 87000, noChargePeriodEnd: '2026-10-31' }

    expect(numberCharge(stored).noChargePeriodEnd).toBe('2026-10-31')
  })

  it('keeps the rest of the row', () => {
    expect(numberCharge({ ...noSchedule, name: 'Волгоград' }))
      .toMatchObject({ name: 'Волгоград' })
  })

  it('offers the last real charge + 30 days and its amount, not the stored values', () => {
    const stored = { ...noSchedule, enabled: false, nextDate: '2026-01-01', amount: 30000 }

    expect(numberCharge(stored, { date: '2026-10-27', amount: 87050 }).offer)
      .toEqual({ nextDate: '2026-11-26', amount: 870.5 })
  })
})

describe('hostingCharge', () => {
  it('gives an enabled hosting its next date and amount in rubles', () => {
    expect(hostingCharge({ enabled: true, nextDate: '2027-03-15', amount: 1200050 }))
      .toEqual({ enabled: true, nextDate: '2027-03-15', amount: 12000.5, offer: null })
  })

  it('hides the stored values of a schedule that is off', () => {
    expect(hostingCharge({ enabled: false, nextDate: '2027-03-15', amount: 1200000 }))
      .toEqual({ enabled: false, nextDate: null, amount: null, offer: null })
  })

  it('offers the last charge + 12 months, and 29.02 falls on 28.02', () => {
    const stored = { enabled: false, nextDate: '2026-01-01', amount: 30000 }

    expect(hostingCharge(stored, { date: '2028-02-29', amount: 1200000 }).offer)
      .toEqual({ nextDate: '2029-02-28', amount: 12000 })
  })
})

describe('isValidInterval', () => {
  it.each([[1, true], [30, true], [0, false], [-30, false], [1.5, false], [NaN, false]])('%d: %s', (days, valid) => {
    expect(isValidInterval(days)).toBe(valid)
  })
})

describe('parseScheduleForm', () => {
  it('gives the date and the amount in kopecks', () => {
    expect(parseScheduleForm({ nextDate: '2026-11-26', amount: '870.50' }))
      .toEqual({ nextDate: '2026-11-26', amount: 87050 })
  })

  it.each(['', '26.11.2026', '2026-11-31', '2026-13-01', '2026-11-26T00:00:00Z', ' 2026-11-26'])(
    'refuses the date %j',
    nextDate => {
      expect(parseScheduleForm({ nextDate, amount: '870' })).toEqual({ error: 'Укажите дату' })
    },
  )

  it('refuses a missing date', () => {
    expect(parseScheduleForm({ amount: '870' })).toEqual({ error: 'Укажите дату' })
  })

  it.each(['', '0', '-870', 'abc', '0.001', 'Infinity', '1e300'])('refuses the amount %j', amount => {
    expect(parseScheduleForm({ nextDate: '2026-11-26', amount })).toEqual({ error: 'Укажите сумму больше нуля' })
  })
})

describe('on a server in another time zone', () => {
  const serverZone = process.env.TZ

  afterEach(() => {
    if (serverZone === undefined) delete process.env.TZ
    else process.env.TZ = serverZone
  })

  it.each([
    ['America/New_York', 240],
    ['Pacific/Kiritimati', -840],
  ])('%s gets the same days', (zone, offsetMinutes) => {
    process.env.TZ = zone
    expect(new Date('2026-10-01T00:00:00Z').getTimezoneOffset()).toBe(offsetMinutes)

    expect(moscowDay(new Date('2026-10-31T20:59:59Z'))).toBe('2026-10-31')
    expect(moscowDay(new Date('2026-10-31T21:00:00Z'))).toBe('2026-11-01')
    // New York leaves daylight time on 2026-11-01, inside this step
    expect(chargesDue({ nextDate: '2026-10-20', intervalDays: 30 }, '2026-10-20').nextDate).toBe('2026-11-19')
  })
})

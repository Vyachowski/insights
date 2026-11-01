import { afterEach, describe, expect, it } from 'vitest'

import {
  chargesDue,
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

describe('reconciledSchedule', () => {
  const schedule = { nextDate: '2026-10-29', amount: 87000, intervalDays: 30 }
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
    { estimated: false, charged: false, noChargePeriodEnd: null },
  ])('with estimated $estimated and charged $charged stores $noChargePeriodEnd', ({ noChargePeriodEnd, ...flags }) => {
    expect(reconciledSchedule(schedule, { ...run, ...flags }).noChargePeriodEnd).toBe(noChargePeriodEnd)
  })
})

describe('numberCharge', () => {
  it('gives an enabled number its next date and amount in rubles', () => {
    expect(numberCharge({ enabled: true, nextDate: '2026-11-26', amount: 87050 }))
      .toEqual({ enabled: true, nextDate: '2026-11-26', amount: 870.5, offer: null })
  })

  it('shows a number with no schedule as off', () => {
    expect(numberCharge({ enabled: null, nextDate: null, amount: null }))
      .toEqual({ enabled: false, nextDate: null, amount: null, offer: null })
  })

  it('hides the stored values of a schedule that is off', () => {
    expect(numberCharge({ enabled: false, nextDate: '2026-11-26', amount: 87000 }))
      .toEqual({ enabled: false, nextDate: null, amount: null, offer: null })
  })

  it('keeps the rest of the row', () => {
    expect(numberCharge({ name: 'Волгоград', enabled: null, nextDate: null, amount: null }))
      .toMatchObject({ name: 'Волгоград' })
  })

  it('offers the last real charge + 30 days and its amount, not the stored values', () => {
    const stored = { enabled: false, nextDate: '2026-01-01', amount: 30000 }

    expect(numberCharge(stored, { date: '2026-10-27', amount: 87050 }).offer)
      .toEqual({ nextDate: '2026-11-26', amount: 870.5 })
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

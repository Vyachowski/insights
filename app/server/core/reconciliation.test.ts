import { describe, expect, it } from 'vitest'

import { isReconciliationStale, reconciledSchedule } from './reconciliation'

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

import { describe, expect, it } from 'vitest'

import { buildDashboardSummary, computeVerdict, mergeCallsByCity, type YearTotals } from './dashboard'

import type { ReconciliationDates } from './auto-charges'

describe('computeVerdict', () => {
  it('reports growth against last year', () => {
    const verdict = computeVerdict(1200, 1000)
    expect(verdict.isGrowing).toBe(true)
    expect(verdict.current).toBe(1200)
    expect(verdict.previous).toBe(1000)
  })

  it('flags a strong swing at or beyond 20%', () => {
    expect(computeVerdict(1000, 1250).isStrong).toBe(true) // -20% exactly on threshold
    expect(computeVerdict(1100, 1000).isStrong).toBe(false) // +10%
    expect(computeVerdict(1300, 1000).isStrong).toBe(true) // +30%
  })

  it('handles a profit that crosses into a loss', () => {
    const verdict = computeVerdict(-134160, 427388)
    expect(verdict.isGrowing).toBe(false)
    expect(verdict.isStrong).toBe(true)
  })

  it('avoids dividing by zero when last year was zero', () => {
    const verdict = computeVerdict(500, 0)
    expect(verdict.isStrong).toBe(false)
    expect(verdict.isGrowing).toBe(true)
  })
})

describe('mergeCallsByCity', () => {
  const cities = [
    { id: 1, name: 'Москва' },
    { id: 2, name: 'Казань' },
    { id: 3, name: 'Пермь' },
  ]

  it('ranks cities by current-year calls, descending', () => {
    const result = mergeCallsByCity(
      cities,
      [
        { cityId: 1, city: 'Москва', count: 400 },
        { cityId: 2, city: 'Казань', count: 900 },
      ],
      [{ cityId: 2, city: 'Казань', count: 800 }],
    )
    expect(result.map(r => r.city)).toEqual(['Казань', 'Москва'])
  })

  it('excludes cities with no calls in either year', () => {
    const result = mergeCallsByCity(cities, [], [])
    expect(result).toEqual([])
  })

  it('keeps a city with calls in only the previous year', () => {
    const result = mergeCallsByCity(
      cities,
      [],
      [{ cityId: 3, city: 'Пермь', count: 120 }],
    )
    expect(result).toEqual([{ city: 'Пермь', current: 0, previous: 120 }])
  })

  it('keeps both current and previous counts per city', () => {
    const [top] = mergeCallsByCity(
      cities,
      [{ cityId: 2, city: 'Казань', count: 900 }],
      [{ cityId: 2, city: 'Казань', count: 875 }],
    )
    expect(top).toEqual({ city: 'Казань', current: 900, previous: 875 })
  })
})

describe('buildDashboardSummary', () => {
  const cities = [{ id: 1, name: 'Москва' }]
  const now = new Date(2026, 4, 15)
  const noDates = { lastRunEnd: null, lastRealDay: null }

  const emptyYear: YearTotals = {
    revenue: 0,
    expenses: 0,
    calls: 0,
    callsByCity: [],
    monthlyRevenue: new Map(),
    monthlyExpenses: new Map(),
  }

  // January and March carry data, so February's gap leaves two elapsed months
  const current: YearTotals = {
    revenue: 600000,
    expenses: 150000,
    calls: 90,
    callsByCity: [{ cityId: 1, city: 'Москва', count: 90 }],
    monthlyRevenue: new Map([[1, 200000], [3, 400000]]),
    monthlyExpenses: new Map([[3, 150000]]),
  }
  const previous: YearTotals = {
    ...emptyYear,
    revenue: 300000,
    expenses: 90000,
    calls: 30,
    callsByCity: [{ cityId: 1, city: 'Москва', count: 30 }],
    monthlyRevenue: new Map([[2, 300000], [8, 900000]]),
    monthlyExpenses: new Map([[2, 90000]]),
  }

  it('turns stored kopecks into a yearly profit verdict in rubles', () => {
    const { verdict } = buildDashboardSummary(current, previous, cities, now, noDates)
    expect(verdict).toMatchObject({ current: 4500, previous: 2100, isGrowing: true, isStrong: true })
  })

  it('takes the reconciled date from the last run, then the last real day', () => {
    const summary = (dates: ReconciliationDates) =>
      buildDashboardSummary(current, previous, cities, now, dates).trends.reconciledUntil

    expect(summary({ lastRunEnd: '2026-10-31', lastRealDay: '2026-10-27' })).toBe('2026-10-31')
    expect(summary({ lastRunEnd: null, lastRealDay: '2026-10-27' })).toBe('2026-10-27')
    expect(summary(noDates)).toBeNull()
  })

  it('averages trends over the elapsed months', () => {
    const { trends } = buildDashboardSummary(current, previous, cities, now, noDates)
    expect(trends.revenue).toEqual({ current: 6000, previous: 3000, monthlyCurrent: 3000, monthlyPrevious: 1500 })
    expect(trends.expenses).toEqual({ current: 1500, previous: 900, monthlyCurrent: 750, monthlyPrevious: 450 })
    expect(trends.calls).toEqual({ current: 90, previous: 30, monthlyCurrent: 45, monthlyPrevious: 15 })
  })

  it('merges calls by city with monthly averages', () => {
    const { callsByCity } = buildDashboardSummary(current, previous, cities, now, noDates)
    expect(callsByCity).toEqual([
      { city: 'Москва', current: 90, previous: 30, monthlyCurrent: 45, monthlyPrevious: 15 },
    ])
  })

  it('lists profit for all 12 months', () => {
    const { monthlyProfit } = buildDashboardSummary(current, previous, cities, now, noDates)
    expect(monthlyProfit.months).toHaveLength(12)
    expect(monthlyProfit.months[0]).toEqual({ month: 1, current: 2000, previous: 0 })
    expect(monthlyProfit.months[1]).toEqual({ month: 2, current: 0, previous: 2100 })
    expect(monthlyProfit.months[2]).toEqual({ month: 3, current: 2500, previous: 0 })
  })

  it('compares both years over the same elapsed months', () => {
    const { monthlyProfit, verdict } = buildDashboardSummary(current, previous, cities, now, noDates)
    expect(monthlyProfit.elapsedMonths).toBe(2)
    expect(monthlyProfit.averageCurrent).toBe(2250)
    expect(monthlyProfit.averagePrevious).toBe(0) // Last year's February and August stay out
    expect(verdict).toMatchObject({ monthlyCurrent: 2250, monthlyPrevious: 1050 })
  })

  it('leaves a future-dated row out of the elapsed months', () => {
    const withFutureRow: YearTotals = {
      ...current,
      monthlyRevenue: new Map([...current.monthlyRevenue, [11, 700000]]),
    }
    const { monthlyProfit } = buildDashboardSummary(withFutureRow, previous, cities, now, noDates)
    expect(monthlyProfit).toMatchObject({ elapsedMonths: 2, averageCurrent: 2250 })
    expect(monthlyProfit.months[10]).toEqual({ month: 11, current: null, previous: 0 })
  })

  it('keeps months after today empty, not zero', () => {
    const { months } = buildDashboardSummary(current, previous, cities, now, noDates).monthlyProfit
    expect(months[4]).toEqual({ month: 5, current: 0, previous: 0 }) // The current month has begun
    expect(months[5]).toEqual({ month: 6, current: null, previous: 0 })
    expect(months[7]).toEqual({ month: 8, current: null, previous: 9000 })
  })

  it('keeps the verdict monthly figures to the same window as its totals', () => {
    const { verdict } = buildDashboardSummary(
      { ...emptyYear, revenue: 130000, monthlyRevenue: new Map([[1, 80000], [2, 50000]]) },
      // Last February closed in full, but only its first half is in the window
      { ...emptyYear, revenue: 120000, monthlyRevenue: new Map([[1, 60000], [2, 100000]]) },
      cities,
      new Date(2026, 1, 15),
      noDates,
    )
    expect(verdict).toMatchObject({ isGrowing: true, monthlyCurrent: 650, monthlyPrevious: 600 })
  })

  it('falls back to the calendar month before any data lands', () => {
    const { monthlyProfit } = buildDashboardSummary(emptyYear, previous, cities, now, noDates)
    expect(monthlyProfit.elapsedMonths).toBe(5)
  })
})

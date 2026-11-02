import { toRubles } from './money'
import { type ReconciliationDates, reconciledUntil } from './reconciliation'

// Below this absolute year-over-year swing the verdict reads as gradual;
// at or above it the «сильно» qualifier is added.
export const STRONG_SWING_PERCENT = 20

export function computeVerdict(current: number, previous: number) {
  const swingPercent
    = previous !== 0 ? ((current - previous) / Math.abs(previous)) * 100 : 0

  return {
    isGrowing: current >= previous,
    isStrong: Math.abs(swingPercent) >= STRONG_SWING_PERCENT,
    current,
    previous,
  }
}

interface CityCallRow {
  cityId: number;
  city: string;
  count: number;
}

export function mergeCallsByCity(
  cities: { id: number; name: string }[],
  currentRows: CityCallRow[],
  previousRows: CityCallRow[],
) {
  const currentByCity = new Map(currentRows.map(r => [r.cityId, r.count]))
  const previousByCity = new Map(previousRows.map(r => [r.cityId, r.count]))

  return cities
    .map(city => ({
      city: city.name,
      current: currentByCity.get(city.id) ?? 0,
      previous: previousByCity.get(city.id) ?? 0,
    }))
    .filter(c => c.current !== 0 || c.previous !== 0)
    .sort((a, b) => b.current - a.current)
}

/** One year of stored figures: money in kopecks, months keyed 1..12. */
export interface YearTotals {
  revenue: number
  expenses: number
  calls: number
  callsByCity: CityCallRow[]
  monthlyRevenue: Map<number, number>
  monthlyExpenses: Map<number, number>
}

function toPeriodData({ revenue, expenses }: YearTotals) {
  return { revenue: toRubles(revenue), expenses: toRubles(expenses), profit: toRubles(revenue - expenses) }
}

function buildMonthlyProfit(current: YearTotals, previous: YearTotals, now: Date) {
  // Profit = revenue − expenses per calendar month (no amortization), so the
  // monthly totals sum back to the yearly profit shown in «Итог».
  const profitAt = (year: YearTotals, m: number) =>
    toRubles((year.monthlyRevenue.get(m) ?? 0) - (year.monthlyExpenses.get(m) ?? 0))

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return {
      month,
      current: profitAt(current, month),
      previous: profitAt(previous, month),
    }
  })

  // Elapsed = months up to today with any revenue or expense, so a gap or a
  // future-dated row changes nothing; before any data lands, every month so far.
  const currentMonth = now.getMonth() + 1
  const hasData = (m: number) =>
    (current.monthlyRevenue.get(m) ?? 0) !== 0 || (current.monthlyExpenses.get(m) ?? 0) !== 0
  const monthsSoFar = months.filter(m => m.month <= currentMonth)
  const monthsWithData = monthsSoFar.filter(m => hasData(m.month))
  const compared = monthsWithData.length > 0 ? monthsWithData : monthsSoFar
  const elapsedMonths = compared.length

  const averageOf = (year: 'current' | 'previous') => {
    let total = 0
    for (const m of compared) total += m[year]
    return total / elapsedMonths
  }

  return {
    // `null` is a month that has not begun, so it reads as empty, not as a zero profit
    months: months.map(m => (m.month > currentMonth ? { ...m, current: null } : m)),
    averageCurrent: averageOf('current'),
    averagePrevious: averageOf('previous'),
    elapsedMonths,
  }
}

export function buildDashboardSummary(
  current: YearTotals,
  previous: YearTotals,
  cities: { id: number; name: string }[],
  now: Date,
  dates: ReconciliationDates,
) {
  const currentPeriod = toPeriodData(current)
  const previousPeriod = toPeriodData(previous)
  const monthlyProfit = buildMonthlyProfit(current, previous, now)

  const withMonthly = <T extends { current: number, previous: number }>(comparison: T) => ({
    ...comparison,
    monthlyCurrent: comparison.current / monthlyProfit.elapsedMonths,
    monthlyPrevious: comparison.previous / monthlyProfit.elapsedMonths,
  })

  return {
    verdict: withMonthly(computeVerdict(currentPeriod.profit, previousPeriod.profit)),
    trends: {
      calls: withMonthly({ current: current.calls, previous: previous.calls }),
      revenue: withMonthly({ current: currentPeriod.revenue, previous: previousPeriod.revenue }),
      expenses: withMonthly({ current: currentPeriod.expenses, previous: previousPeriod.expenses }),
      reconciledUntil: reconciledUntil(dates),
    },
    callsByCity: mergeCallsByCity(cities, current.callsByCity, previous.callsByCity).map(withMonthly),
    monthlyProfit,
  }
}

export type DashboardSummary = ReturnType<typeof buildDashboardSummary>

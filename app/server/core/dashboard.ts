import { toRubles } from './money'

// Below this absolute year-over-year swing the verdict reads as gradual;
// at or above it the «сильно» qualifier is added.
export const STRONG_SWING_PERCENT = 20

export function computeVerdict(current: number, previous: number) {
  const growthPercent
    = previous !== 0 ? ((current - previous) / Math.abs(previous)) * 100 : 0

  return {
    isGrowing: current >= previous,
    isStrong: Math.abs(growthPercent) >= STRONG_SWING_PERCENT,
    growthPercent: Number(growthPercent.toFixed(1)),
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
  const revenueRubles = toRubles(revenue)
  const expensesRubles = toRubles(expenses)
  return { revenue: revenueRubles, expenses: expensesRubles, profit: revenueRubles - expensesRubles }
}

function buildMonthlyProfit(current: YearTotals, previous: YearTotals, now: Date) {
  // Profit = revenue − expenses per calendar month (no amortization), so the
  // monthly totals sum back to the yearly profit shown in «Итог».
  const profitAt = (year: YearTotals, m: number) =>
    toRubles(year.monthlyRevenue.get(m) ?? 0) - toRubles(year.monthlyExpenses.get(m) ?? 0)

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return {
      month,
      current: profitAt(current, month),
      previous: profitAt(previous, month),
    }
  })

  // Elapsed = latest current-year month with any revenue or expense; before any
  // data lands, fall back to the current calendar month.
  let lastWithData = 0
  for (let m = 1; m <= 12; m++) {
    if ((current.monthlyRevenue.get(m) ?? 0) !== 0 || (current.monthlyExpenses.get(m) ?? 0) !== 0) lastWithData = m
  }
  const elapsedMonths = lastWithData || now.getMonth() + 1

  const averageThrough = (year: YearTotals) => {
    let total = 0
    for (let m = 1; m <= elapsedMonths; m++) total += profitAt(year, m)
    return total / elapsedMonths
  }

  return {
    months,
    averageCurrent: averageThrough(current),
    averagePrevious: averageThrough(previous),
    elapsedMonths,
  }
}

export function buildDashboardSummary(
  current: YearTotals,
  previous: YearTotals,
  cities: { id: number; name: string }[],
  now: Date,
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
    verdict: {
      ...computeVerdict(currentPeriod.profit, previousPeriod.profit),
      monthlyCurrent: monthlyProfit.averageCurrent,
      monthlyPrevious: monthlyProfit.averagePrevious,
    },
    trends: {
      calls: withMonthly({ current: current.calls, previous: previous.calls }),
      revenue: withMonthly({ current: currentPeriod.revenue, previous: previousPeriod.revenue }),
      expenses: withMonthly({ current: currentPeriod.expenses, previous: previousPeriod.expenses }),
    },
    callsByCity: mergeCallsByCity(cities, current.callsByCity, previous.callsByCity).map(withMonthly),
    monthlyProfit,
  }
}

export type DashboardSummary = ReturnType<typeof buildDashboardSummary>

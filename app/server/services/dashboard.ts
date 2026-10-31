import type { Period } from '@/server/db/queries/period'

import { buildDashboardSummary, type YearTotals } from '@/server/core/dashboard'
import { getComparablePeriods } from '@/server/core/periods'
import { countFirstCalls, countFirstCallsByCity } from '@/server/db/queries/calls'
import { listCities } from '@/server/db/queries/cities'
import { sumExpenses, sumExpensesByMonth, sumRevenue, sumRevenueByMonth } from '@/server/db/queries/totals'

async function loadYear(period: Period): Promise<YearTotals> {
  const year = period.start.getFullYear()
  const [revenue, expenses, calls, callsByCity, monthlyRevenue, monthlyExpenses] = await Promise.all([
    sumRevenue(period),
    sumExpenses(period),
    countFirstCalls(period),
    countFirstCallsByCity(period),
    sumRevenueByMonth(year),
    sumExpensesByMonth(year),
  ])
  return { revenue, expenses, calls, callsByCity, monthlyRevenue, monthlyExpenses }
}

export async function getDashboardSummary(now = new Date()) {
  const { currentYear, previousYear } = getComparablePeriods(now)
  const [current, previous, cities] = await Promise.all([
    loadYear(currentYear),
    loadYear(previousYear),
    listCities(),
  ])
  return buildDashboardSummary(current, previous, cities, now)
}

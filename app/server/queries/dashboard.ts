import { and, eq, sql, sum } from 'drizzle-orm'

import { computeVerdict, mergeCallsByCity } from './dashboard.calc'

import type { MonthlyProfitDto } from '@/lib/types'
import type { SQL } from 'drizzle-orm'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'

import DateService from '@/lib/date.service'
import { db } from '@/server/db'
import { callImports, cities, expenses, revenues, sites } from '@/server/schema'

export interface Period {
  start: Date
  end: Date
}

export interface PeriodData {
  revenue: number
  expenses: number
  profit: number
}

// DATE-as-text columns compare lexicographically ('YYYY-MM-DD' sorts
// correctly); timestamp columns are integer epoch-ms comparisons.
const toUtcDate = (d: Date) => d.toISOString().slice(0, 10)

const betweenDates = (column: AnySQLiteColumn, { start, end }: Period): SQL =>
  sql`${column} >= ${toUtcDate(start)} AND ${column} <= ${toUtcDate(end)}`

const betweenInstants = (column: AnySQLiteColumn, { start, end }: Period): SQL =>
  sql`${column} >= ${start.getTime()} AND ${column} <= ${end.getTime()}`

async function fetchPeriodData(period: Period): Promise<PeriodData> {
  const [[rev], [exp]] = await Promise.all([
    db
      .select({ total: sum(revenues.amount) })
      .from(revenues)
      .where(betweenDates(revenues.date, period)),
    db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(betweenDates(expenses.date, period)),
  ])

  // Stored as integer kopecks; loader JSON stays in rubles
  const revenue = Number(rev?.total ?? 0) / 100
  const expensesTotal = Number(exp?.total ?? 0) / 100
  return { revenue, expenses: expensesTotal, profit: revenue - expensesTotal }
}

// A call is counted once per unique call (callNumber === 1 is the primary row).
async function fetchCallsTotal(period: Period): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(callImports)
    .where(
      and(eq(callImports.callNumber, 1), betweenInstants(callImports.date, period)),
    )
  return Number(row?.total ?? 0)
}

async function fetchCallsByCity(current: Period, previous: Period) {
  const callsForPeriod = (period: Period) =>
    db
      .select({
        cityId: cities.id,
        city: cities.name,
        count: sql<number>`count(*)`,
      })
      .from(callImports)
      .innerJoin(sites, eq(callImports.siteId, sites.id))
      .innerJoin(cities, eq(sites.cityId, cities.id))
      .where(
        and(
          eq(callImports.callNumber, 1),
          betweenInstants(callImports.date, period),
        ),
      )
      .groupBy(cities.id)

  const [currentRows, previousRows, allCities] = await Promise.all([
    callsForPeriod(current),
    callsForPeriod(previous),
    db.select({ id: cities.id, name: cities.name }).from(cities),
  ])

  return mergeCallsByCity(
    allCities,
    currentRows.map(r => ({ ...r, count: Number(r.count) })),
    previousRows.map(r => ({ ...r, count: Number(r.count) })),
  )
}

// Per-month totals of a date/amount table for one year, keyed by month (1..12),
// in rubles. Works for both `revenues` and `expenses` (same date/amount shape).
async function fetchMonthlyTotals(
  table: typeof revenues | typeof expenses,
  year: number,
): Promise<Map<number, number>> {
  const monthExpr = sql<string>`substr(${table.date}, 6, 2)`
  const rows = await db
    .select({ month: monthExpr, total: sum(table.amount) })
    .from(table)
    .where(sql`${table.date} >= ${`${year}-01-01`} AND ${table.date} <= ${`${year}-12-31`}`)
    .groupBy(monthExpr)

  const map = new Map<number, number>()
  for (const r of rows) map.set(Number(r.month), Number(r.total ?? 0) / 100)
  return map
}

async function fetchMonthlyProfit(
  currentYearNum: number,
  previousYearNum: number,
): Promise<MonthlyProfitDto> {
  const [curRev, curExp, prevRev, prevExp] = await Promise.all([
    fetchMonthlyTotals(revenues, currentYearNum),
    fetchMonthlyTotals(expenses, currentYearNum),
    fetchMonthlyTotals(revenues, previousYearNum),
    fetchMonthlyTotals(expenses, previousYearNum),
  ])

  // Profit = revenue − expenses per calendar month (no amortization), so the
  // monthly totals sum back to the yearly profit shown in «Итог».
  const profitAt = (rev: Map<number, number>, exp: Map<number, number>, m: number) =>
    (rev.get(m) ?? 0) - (exp.get(m) ?? 0)

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return {
      month,
      current: profitAt(curRev, curExp, month),
      previous: profitAt(prevRev, prevExp, month),
    }
  })

  // Elapsed = latest current-year month with any revenue or expense; before any
  // data lands, fall back to the current calendar month.
  let lastWithData = 0
  for (let m = 1; m <= 12; m++) {
    if ((curRev.get(m) ?? 0) !== 0 || (curExp.get(m) ?? 0) !== 0) lastWithData = m
  }
  const elapsedMonths = lastWithData || new Date().getMonth() + 1

  const averageThrough = (rev: Map<number, number>, exp: Map<number, number>) => {
    let total = 0
    for (let m = 1; m <= elapsedMonths; m++) total += profitAt(rev, exp, m)
    return total / elapsedMonths
  }

  return {
    months,
    averageCurrent: averageThrough(curRev, curExp),
    averagePrevious: averageThrough(prevRev, prevExp),
    elapsedMonths,
  }
}

export async function getDashboardSummary() {
  const { currentYear, previousYear } = new DateService().getComparablePeriods()
  const currentYearNum = currentYear.start.getFullYear()
  const previousYearNum = previousYear.start.getFullYear()

  const [current, previous, callsCurrent, callsPrevious, callsByCity, monthlyProfit]
    = await Promise.all([
      fetchPeriodData(currentYear),
      fetchPeriodData(previousYear),
      fetchCallsTotal(currentYear),
      fetchCallsTotal(previousYear),
      fetchCallsByCity(currentYear, previousYear),
      fetchMonthlyProfit(currentYearNum, previousYearNum),
    ])

  return {
    verdict: computeVerdict(current.profit, previous.profit),
    trends: {
      calls: { current: callsCurrent, previous: callsPrevious },
      revenue: { current: current.revenue, previous: previous.revenue },
      expenses: { current: current.expenses, previous: previous.expenses },
    },
    callsByCity,
    monthlyProfit,
  }
}

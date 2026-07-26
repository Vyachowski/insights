import { and, eq, sql, sum } from 'drizzle-orm'

import { computeVerdict, mergeCallsByCity } from './dashboard.calc'

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

export async function getDashboardSummary() {
  const { currentYear, previousYear } = new DateService().getComparablePeriods()

  const [current, previous, callsCurrent, callsPrevious, callsByCity]
    = await Promise.all([
      fetchPeriodData(currentYear),
      fetchPeriodData(previousYear),
      fetchCallsTotal(currentYear),
      fetchCallsTotal(previousYear),
      fetchCallsByCity(currentYear, previousYear),
    ])

  return {
    verdict: computeVerdict(current.profit, previous.profit),
    trends: {
      calls: { current: callsCurrent, previous: callsPrevious },
      revenue: { current: current.revenue, previous: previous.revenue },
      expenses: { current: current.expenses, previous: previous.expenses },
    },
    callsByCity,
  }
}

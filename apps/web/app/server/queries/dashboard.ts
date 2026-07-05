import { and, eq, exists, sql, sum } from 'drizzle-orm'

import type { SQL } from 'drizzle-orm'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'

import DateService from '@/lib/date.service'
import { db } from '@/server/db'
import { callImports, cities, expenses, revenues, siteMetrics, sites } from '@/server/schema'

export interface Period {
  start: Date
  end: Date
}

export interface PeriodData {
  revenue: number
  expenses: number
  profit: number
}

export interface WeekData {
  week: number
  current: PeriodData
  previous: PeriodData
}

interface DashboardPeriods {
  lastWeek: Period
  currentMonth: Period
  lastYearSameMonth: Period
  currentYearWeeks: Period[]
  previousYearWeeks: Period[]
}

// Parity with the old Prisma queries: filters on DATE columns are truncated
// to UTC calendar dates (Prisma does this for @db.Date fields), while
// TIMESTAMP columns are compared as instants.
const toUtcDate = (d: Date) => d.toISOString().slice(0, 10)

const betweenDates = (column: AnyPgColumn, { start, end }: Period): SQL =>
  sql`${column} >= ${toUtcDate(start)} AND ${column} <= ${toUtcDate(end)}`

const betweenInstants = (column: AnyPgColumn, { start, end }: Period): SQL =>
  sql`${column} >= CAST(${start} AS timestamptz) AND ${column} <= CAST(${end} AS timestamptz)`

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

  const revenue = Number(rev?.total ?? 0)
  const expensesTotal = Number(exp?.total ?? 0)
  return { revenue, expenses: expensesTotal, profit: revenue - expensesTotal }
}

async function fetchYearlyWeeks(
  currentYearPeriods: Period[],
  previousYearPeriods: Period[],
): Promise<WeekData[]> {
  return Promise.all(
    currentYearPeriods.map(async (current, i) => {
      const [currentData, previousData] = await Promise.all([
        fetchPeriodData(current),
        fetchPeriodData(previousYearPeriods[i]),
      ])
      return { week: i + 1, current: currentData, previous: previousData }
    }),
  )
}

async function getPeriodProfit(period: Period): Promise<number> {
  const { profit } = await fetchPeriodData(period)
  return profit
}

async function getActiveSitesWithCities(period: Period) {
  return db
    .select({ id: sites.id, cityName: cities.name })
    .from(sites)
    .innerJoin(cities, eq(sites.cityId, cities.id))
    .where(
      exists(
        db
          .select({ one: sql`1` })
          .from(callImports)
          .where(
            and(
              eq(callImports.siteId, sites.id),
              betweenInstants(callImports.date, period),
            ),
          ),
      ),
    )
    .orderBy(sites.id)
}

async function calculateProfitShareByCities(period: Period) {
  const [activeSites, [formTotals], [callTotals], formBySite, callsBySite]
    = await Promise.all([
      getActiveSitesWithCities(period),
      db
        .select({
          leadsYandex: sum(siteMetrics.leadsYandex),
          leadsGoogle: sum(siteMetrics.leadsGoogle),
          leadsOther: sum(siteMetrics.leadsOther),
        })
        .from(siteMetrics)
        .where(betweenDates(siteMetrics.date, period)),
      db
        .select({ total: sum(callImports.callNumber) })
        .from(callImports)
        .where(
          and(eq(callImports.callNumber, 1), betweenInstants(callImports.date, period)),
        ),
      db
        .select({
          siteId: siteMetrics.siteId,
          leadsYandex: sum(siteMetrics.leadsYandex),
          leadsGoogle: sum(siteMetrics.leadsGoogle),
          leadsOther: sum(siteMetrics.leadsOther),
        })
        .from(siteMetrics)
        .where(betweenDates(siteMetrics.date, period))
        .groupBy(siteMetrics.siteId),
      db
        .select({ siteId: callImports.siteId, count: sql<number>`count(*)::int` })
        .from(callImports)
        .where(
          and(eq(callImports.callNumber, 1), betweenInstants(callImports.date, period)),
        )
        .groupBy(callImports.siteId),
    ])

  const totalLeads
    = Number(formTotals?.leadsYandex ?? 0)
      + Number(formTotals?.leadsGoogle ?? 0)
      + Number(formTotals?.leadsOther ?? 0)
      + Number(callTotals?.total ?? 0)

  return activeSites.map(site => {
    const form = formBySite.find(m => m.siteId === site.id)
    const formLeads
      = Number(form?.leadsYandex ?? 0)
        + Number(form?.leadsGoogle ?? 0)
        + Number(form?.leadsOther ?? 0)
    const callLeads = callsBySite.find(c => c.siteId === site.id)?.count ?? 0
    const leadsShare = Number(((callLeads + formLeads) / totalLeads).toFixed(3))

    return { city: site.cityName, leadsShare }
  })
}

function calculateCitiesProfit(
  totalProfit: number,
  shares: { city: string; leadsShare: number }[],
) {
  return shares.map(share => ({
    city: share.city,
    profit: Math.floor(totalProfit * share.leadsShare),
  }))
}

function buildLastWeekSummary(data: PeriodData, period: Period) {
  return {
    weekStart: period.start.toISOString(),
    weekEnd: period.end.toISOString(),
    ...data,
  }
}

function buildMonthlyComparison(
  currentMonth: PeriodData,
  lastYearSameMonth: PeriodData,
  periods: DashboardPeriods,
) {
  const difference = currentMonth.profit - lastYearSameMonth.profit
  const percentage
    = lastYearSameMonth.profit !== 0
      ? (difference / lastYearSameMonth.profit) * 100
      : 0

  return {
    currentMonth: {
      month: periods.currentMonth.start.toISOString(),
      profit: currentMonth.profit,
    },
    lastYearSameMonth: {
      month: periods.lastYearSameMonth.start.toISOString(),
      profit: lastYearSameMonth.profit,
    },
    difference,
    percentage: Number(percentage.toFixed(1)),
  }
}

function buildYearlyTrend(weeks: WeekData[]) {
  return weeks.map(({ week, current, previous }) => ({
    week,
    current: current.profit,
    previous: previous.profit,
  }))
}

function buildBusinessHealth(weeks: WeekData[]) {
  const avgCurrent
    = weeks.reduce((acc, w) => acc + w.current.profit, 0) / weeks.length
  const avgPrevious
    = weeks.reduce((acc, w) => acc + w.previous.profit, 0) / weeks.length
  const growthPercent = ((avgCurrent - avgPrevious) / avgPrevious) * 100

  return {
    isGrowing: growthPercent > 0,
    growthPercent: Number(growthPercent.toFixed(1)),
    avgCurrent: Math.round(avgCurrent),
    avgPrevious: Math.round(avgPrevious),
  }
}

async function fetchCitiesProfit(dateService: DateService) {
  const { currentYear, previousYear } = dateService.getComparablePeriods()

  const [currentProfit, previousProfit, shareCurrent, sharePrevious]
    = await Promise.all([
      getPeriodProfit(currentYear),
      getPeriodProfit(previousYear),
      calculateProfitShareByCities(currentYear),
      calculateProfitShareByCities(previousYear),
    ])

  return [
    {
      year: currentYear.start.getFullYear(),
      cities: calculateCitiesProfit(currentProfit, shareCurrent),
    },
    {
      year: previousYear.start.getFullYear(),
      cities: calculateCitiesProfit(previousProfit, sharePrevious),
    },
  ]
}

export async function getDashboardSummary() {
  const dateService = new DateService()
  const yearlyWeeks = dateService.getYearlyCompletedWeeks()
  const periods: DashboardPeriods = {
    lastWeek: dateService.getLastWeek(),
    currentMonth: dateService.getCurrentMonth(),
    lastYearSameMonth: dateService.getLastYearSameMonth(),
    currentYearWeeks: yearlyWeeks.currentYear,
    previousYearWeeks: yearlyWeeks.previousYear,
  }

  const [lastWeek, currentMonth, lastYearSameMonth, weeks, citiesProfit]
    = await Promise.all([
      fetchPeriodData(periods.lastWeek),
      fetchPeriodData(periods.currentMonth),
      fetchPeriodData(periods.lastYearSameMonth),
      fetchYearlyWeeks(periods.currentYearWeeks, periods.previousYearWeeks),
      fetchCitiesProfit(dateService),
    ])

  return {
    lastWeekSummary: buildLastWeekSummary(lastWeek, periods.lastWeek),
    monthlyComparison: buildMonthlyComparison(
      currentMonth,
      lastYearSameMonth,
      periods,
    ),
    yearlyProfitTrend: buildYearlyTrend(weeks),
    citiesProfit,
    businessHealth: buildBusinessHealth(weeks),
  }
}

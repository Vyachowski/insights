import { sql, sum } from 'drizzle-orm'

import { db } from './client'
import { betweenDates, type Period } from './period'
import { expenses, revenues } from './schema'

type AmountTable = typeof revenues | typeof expenses

async function sumAmount(table: AmountTable, period: Period): Promise<number> {
  const [row] = await db
    .select({ total: sum(table.amount) })
    .from(table)
    .where(betweenDates(table.date, period))
  return Number(row?.total ?? 0)
}

// Per-month totals in kopecks for one year, keyed by month (1..12)
async function sumAmountByMonth(table: AmountTable, year: number): Promise<Map<number, number>> {
  const monthExpr = sql<string>`substr(${table.date}, 6, 2)`
  const rows = await db
    .select({ month: monthExpr, total: sum(table.amount) })
    .from(table)
    .where(sql`${table.date} >= ${`${year}-01-01`} AND ${table.date} <= ${`${year}-12-31`}`)
    .groupBy(monthExpr)

  return new Map(rows.map(r => [Number(r.month), Number(r.total ?? 0)]))
}

export const sumRevenue = (period: Period) => sumAmount(revenues, period)
export const sumExpenses = (period: Period) => sumAmount(expenses, period)
export const sumRevenueByMonth = (year: number) => sumAmountByMonth(revenues, year)
export const sumExpensesByMonth = (year: number) => sumAmountByMonth(expenses, year)

import { and, eq, isNull } from 'drizzle-orm'

import {
  assertCsvColumns,
  assertSkipRate,
  CsvValidationError,
  fetchUrlToBuffer,
  parseCsvBuffer,
} from './csv'

import { db } from '@/server/db'
import { expenses, revenues, siteMetrics } from '@/server/schema'

export { CsvValidationError, fetchUrlToBuffer }

export interface ImportResult {
  created: number
  skipped: number
  updated?: number
}

const toUtcDate = (d: Date) => d.toISOString().slice(0, 10)

// ---------------------------------------------------------------- revenue

async function importRevenue(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['date', 'siteId', 'amount'])

  let created = 0
  let updated = 0
  let skipped = 0
  let invalid = 0

  for (const row of rows) {
    const date = row['date'] ? new Date(row['date']) : null
    const parsed = Number(row['amount'])
    const amount = Math.round(parsed * 100) // integer kopecks
    const siteId = row['siteId'] ? Number(row['siteId']) : null
    if (!date || isNaN(date.getTime()) || isNaN(parsed) || (siteId !== null && isNaN(siteId))) {
      invalid++
      continue
    }

    const dateStr = toUtcDate(date)
    const [existing] = await db
      .select({ id: revenues.id, amount: revenues.amount })
      .from(revenues)
      .where(and(
        eq(revenues.date, dateStr),
        siteId === null ? isNull(revenues.siteId) : eq(revenues.siteId, siteId),
      ))
      .limit(1)

    if (existing && existing.amount === amount) {
      skipped++
    } else if (existing) {
      await db.update(revenues).set({ amount }).where(eq(revenues.id, existing.id))
      updated++
    } else {
      await db.insert(revenues).values({ date: dateStr, siteId, amount })
      created++
    }
  }

  assertSkipRate(created + updated + skipped, invalid)
  return { created, updated, skipped }
}

// ---------------------------------------------------------------- expenses

async function importExpenses(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['date', 'type', 'siteId', 'amount'])

  let created = 0
  let updated = 0
  let skipped = 0
  let invalid = 0

  for (const row of rows) {
    const date = new Date(row['date'])
    const siteId = row['siteId'] ? Number(row['siteId']) : null
    const parsed = parseFloat(row['amount'])
    const amount = Math.round(parsed * 100) // integer kopecks
    const type = row['type']?.trim()
    if (!type || isNaN(parsed) || isNaN(date.getTime())) {
      invalid++
      continue
    }

    const dateStr = toUtcDate(date)
    const [existing] = await db
      .select({ id: expenses.id, amount: expenses.amount })
      .from(expenses)
      .where(and(
        eq(expenses.date, dateStr),
        eq(expenses.type, type),
        siteId === null ? isNull(expenses.siteId) : eq(expenses.siteId, siteId),
      ))
      .limit(1)

    if (existing && existing.amount === amount) {
      skipped++
    } else if (existing) {
      await db.update(expenses).set({ amount }).where(eq(expenses.id, existing.id))
      updated++
    } else {
      await db.insert(expenses).values({ date: dateStr, siteId, amount, type })
      created++
    }
  }

  assertSkipRate(created + updated + skipped, invalid)
  return { created, updated, skipped }
}

// ---------------------------------------------------------------- metrics

const METRIC_NUMBER_COLUMNS = [
  'yandexUsers',
  'googleUsers',
  'otherUsers',
  'visitDurationYandexInSec',
  'visitDurationGoogleInSec',
  'visitDurationOtherInSec',
  'bounceYandex',
  'bounceGoogle',
  'bounceOther',
  'leadsYandex',
  'leadsGoogle',
  'leadsOther',
] as const

async function importMetrics(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['siteId', 'date', ...METRIC_NUMBER_COLUMNS])

  let created = 0
  let skipped = 0

  for (const row of rows) {
    const siteId = Number(row['siteId'])
    const date = row['date'] ? new Date(row['date']) : null
    if (!siteId || isNaN(siteId) || !date || isNaN(date.getTime())) {
      skipped++
      continue
    }

    const data = Object.fromEntries(
      METRIC_NUMBER_COLUMNS.map(col => [col, Number(row[col] ?? 0) || 0]),
    )
    await db
      .insert(siteMetrics)
      .values({ siteId, date: toUtcDate(date), ...data })
      .onConflictDoUpdate({
        target: [siteMetrics.siteId, siteMetrics.date],
        set: data,
      })
    created++
  }

  assertSkipRate(created, skipped)
  return { created, skipped }
}

// ---------------------------------------------------------------- calls

// Switched off until the new import lands: the old one wrote to a table that
// no longer exists.
async function importCalls(): Promise<ImportResult> {
  throw new CsvValidationError(
    'Импорт звонков временно отключён: звонки перенесены в новую таблицу. Новые звонки приходят через вебхук.',
  )
}

// ---------------------------------------------------------------- dispatch

export const importers = {
  revenue: importRevenue,
  expenses: importExpenses,
  metrics: importMetrics,
  calls: importCalls,
} as const

export type ImportResource = keyof typeof importers

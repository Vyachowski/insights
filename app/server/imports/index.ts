import {
  assertCsvColumns,
  assertSkipRate,
  CsvValidationError,
  fetchUrlToBuffer,
  parseCsvBuffer,
} from './csv'

import { importCallsCsv } from '@/server/calls/csv-import'
import { db } from '@/server/db'
import { upsertExpense } from '@/server/expenses/upsert'
import { upsertRevenue } from '@/server/revenues/upsert'
import { siteMetrics, sites } from '@/server/schema'

export { CsvValidationError, fetchUrlToBuffer }

export interface ImportResult {
  created: number
  skipped: number
  updated?: number
}

type CsvRow = Record<string, string>
type SiteIds = ReadonlySet<number>

const toUtcDate = (d: Date) => d.toISOString().slice(0, 10)

function parseDate(raw: string | undefined): string | null {
  const date = raw ? new Date(raw) : null
  return date && !isNaN(date.getTime()) ? toUtcDate(date) : null
}

/** An empty cell is a company-level row; `undefined` marks an unusable cell. */
function parseSiteId(raw: string | undefined, siteIds: SiteIds): number | null | undefined {
  if (!raw) return null
  const siteId = Number(raw)
  return siteIds.has(siteId) ? siteId : undefined
}

function parseKopecks(raw: string | undefined): number | null {
  const rubles = raw ? Number(raw) : NaN
  return Number.isFinite(rubles) ? Math.round(rubles * 100) : null // integer kopecks
}

async function loadSiteIds(): Promise<SiteIds> {
  const rows = await db.select({ id: sites.id }).from(sites)
  return new Set(rows.map(({ id }) => id))
}

/** Parses every row, then writes: a rejected file must leave the table as it was. */
async function upsertRows<T>(
  rows: CsvRow[],
  parseRow: (row: CsvRow) => T | null,
  upsert: (value: T) => Promise<'created' | 'updated' | 'skipped'>,
): Promise<ImportResult> {
  const values = rows.map(parseRow).filter(value => value !== null)
  assertSkipRate(values.length, rows.length - values.length)

  const result = { created: 0, updated: 0, skipped: 0 }
  for (const value of values) result[await upsert(value)]++
  return result
}

// ---------------------------------------------------------------- revenue

function parseRevenueRow(row: CsvRow, siteIds: SiteIds) {
  const date = parseDate(row['date'])
  const siteId = parseSiteId(row['siteId'], siteIds)
  const amount = parseKopecks(row['amount'])
  if (date === null || siteId === undefined || amount === null) return null
  return { date, siteId, amount }
}

async function importRevenue(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['date', 'siteId', 'amount'])

  const siteIds = await loadSiteIds()
  return upsertRows(rows, row => parseRevenueRow(row, siteIds), upsertRevenue)
}

// ---------------------------------------------------------------- expenses

function parseExpenseRow(row: CsvRow, siteIds: SiteIds) {
  const date = parseDate(row['date'])
  const siteId = parseSiteId(row['siteId'], siteIds)
  const amount = parseKopecks(row['amount'])
  const type = row['type']?.trim()
  if (date === null || siteId === undefined || amount === null || !type) return null
  return { date, siteId, amount, type }
}

async function importExpenses(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['date', 'type', 'siteId', 'amount'])

  const siteIds = await loadSiteIds()
  return upsertRows(rows, row => parseExpenseRow(row, siteIds), upsertExpense)
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

function parseMetricRow(row: CsvRow, siteIds: SiteIds) {
  const siteId = parseSiteId(row['siteId'], siteIds)
  const date = parseDate(row['date'])
  if (!siteId || date === null) return null

  const data = Object.fromEntries(
    METRIC_NUMBER_COLUMNS.map(col => [col, Number(row[col] ?? 0) || 0]),
  )
  return { siteId, date, data }
}

async function importMetrics(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['siteId', 'date', ...METRIC_NUMBER_COLUMNS])

  const siteIds = await loadSiteIds()
  const values = rows
    .map(row => parseMetricRow(row, siteIds))
    .filter(value => value !== null)
  const skipped = rows.length - values.length
  assertSkipRate(values.length, skipped)

  for (const { siteId, date, data } of values) {
    await db
      .insert(siteMetrics)
      .values({ siteId, date, ...data })
      .onConflictDoUpdate({
        target: [siteMetrics.siteId, siteMetrics.date],
        set: data,
      })
  }
  return { created: values.length, skipped }
}

// ---------------------------------------------------------------- dispatch

export const importers = {
  revenue: importRevenue,
  expenses: importExpenses,
  metrics: importMetrics,
  calls: importCallsCsv,
} as const

export type ImportResource = keyof typeof importers

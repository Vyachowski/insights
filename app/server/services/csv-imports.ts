import { importCallsCsv } from './calls-csv-import'

import {
  assertCsvColumns,
  assertSkipRate,
  CsvValidationError,
  type CsvRow,
  parseCsvBuffer,
} from '@/server/core/csv'
import {
  METRIC_NUMBER_COLUMNS,
  parseExpenseRow,
  parseMetricRow,
  parseRevenueRow,
} from '@/server/core/csv-rows'
import { upsertExpense } from '@/server/db/queries/expenses'
import { upsertMetric } from '@/server/db/queries/metrics'
import { upsertRevenue } from '@/server/db/queries/revenues'
import { listSiteIds } from '@/server/db/queries/sites'

export { CsvValidationError }

export interface ImportResult {
  created: number
  skipped: number
  updated?: number
  // Calls import only: rows left for a person to resolve
  disputed?: number
  disputedCsv?: string | null
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

async function importRevenue(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['date', 'siteId', 'amount'])

  const siteIds = await listSiteIds()
  return upsertRows(rows, row => parseRevenueRow(row, siteIds), upsertRevenue)
}

async function importExpenses(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['date', 'type', 'siteId', 'amount'])

  const siteIds = await listSiteIds()
  return upsertRows(rows, row => parseExpenseRow(row, siteIds), upsertExpense)
}

async function importMetrics(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['siteId', 'date', ...METRIC_NUMBER_COLUMNS])

  const siteIds = await listSiteIds()
  const values = rows
    .map(row => parseMetricRow(row, siteIds))
    .filter(value => value !== null)
  const skipped = rows.length - values.length
  assertSkipRate(values.length, skipped)

  for (const { siteId, date, data } of values) await upsertMetric(siteId, date, data)
  return { created: values.length, skipped }
}

export const importers = {
  revenue: importRevenue,
  expenses: importExpenses,
  metrics: importMetrics,
  calls: importCallsCsv,
} as const

export type ImportResource = keyof typeof importers

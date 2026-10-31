import { toKopecks } from './money'

import type { CsvRow } from './csv'

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
  return Number.isFinite(rubles) ? toKopecks(rubles) : null
}

export function parseRevenueRow(row: CsvRow, siteIds: SiteIds) {
  const date = parseDate(row['date'])
  const siteId = parseSiteId(row['siteId'], siteIds)
  const amount = parseKopecks(row['amount'])
  if (date === null || siteId === undefined || amount === null) return null
  return { date, siteId, amount }
}

export function parseExpenseRow(row: CsvRow, siteIds: SiteIds) {
  const date = parseDate(row['date'])
  const siteId = parseSiteId(row['siteId'], siteIds)
  const amount = parseKopecks(row['amount'])
  const type = row['type']?.trim()
  if (date === null || siteId === undefined || amount === null || !type) return null
  return { date, siteId, amount, type }
}

export const METRIC_NUMBER_COLUMNS = [
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

export function parseMetricRow(row: CsvRow, siteIds: SiteIds) {
  const siteId = parseSiteId(row['siteId'], siteIds)
  const date = parseDate(row['date'])
  if (!siteId || date === null) return null

  const data = Object.fromEntries(
    METRIC_NUMBER_COLUMNS.map(col => [col, Number(row[col] ?? 0) || 0]),
  )
  return { siteId, date, data }
}

import { and, eq, isNull, sql } from 'drizzle-orm'

import {
  assertCsvColumns,
  assertSkipRate,
  CsvValidationError,
  fetchUrlToBuffer,
  parseCsvBuffer,
} from './csv'

import { db } from '@/server/db'
import { callImports, expenses, revenues, siteMetrics, sites, cities } from '@/server/schema'

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

// City name aliases used to resolve Gudok project titles to canonical city names
const CITY_ALIASES: Record<string, string[]> = {
  новосибирск: ['нск'],
  'санкт-петербург': ['спб', 'петербург'],
  'нижний новгород': ['нижний'],
  екатеринбург: ['екб'],
  'ростов-на-дону': ['ростов'],
  'набережные челны': ['челны'],
}

function resolveProjectTitle(raw: string): string {
  const cleaned = raw
    .replace(/^Дезинсекция – /, '')
    .replace(/ – Дезинсекция$/, '')
    .trim()
    .toLowerCase()

  for (const [canonical, aliases] of Object.entries(CITY_ALIASES)) {
    if (aliases.includes(cleaned)) return canonical
  }
  return cleaned
}

function parseGudokDate(raw: string): Date | null {
  // Format: "31.12.25 12:05" → dd.MM.yy HH:mm
  const match = raw.match(/^(\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/)
  if (!match) return null
  const [, dd, mm, yy, hh, min] = match
  return new Date(`20${yy}-${mm}-${dd}T${hh}:${min}:00`)
}

const CHUNK_SIZE = 1000

async function importCalls(buffer: Buffer): Promise<ImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['Дата', 'Кто звонил', '№', 'Проект', 'Куда звонил'])

  const siteRows = await db
    .select({ id: sites.id, cityName: cities.name })
    .from(sites)
    .innerJoin(cities, eq(sites.cityId, cities.id))
  const cityToSiteId = new Map(siteRows.map(s => [s.cityName.toLowerCase(), s.id]))

  let invalidCount = 0
  const records: (typeof callImports.$inferInsert)[] = []

  for (const row of rows) {
    const date = parseGudokDate(row['Дата'] ?? '')
    const src = row['Кто звонил']?.trim()
    const callNumber = Number(row['№'])
    const projectTitle = resolveProjectTitle(row['Проект'] ?? '')
    const siteId = cityToSiteId.get(projectTitle)

    if (!date || !src || isNaN(callNumber) || siteId === undefined) {
      invalidCount++
      continue
    }

    records.push({
      siteId,
      date,
      src,
      callNumber,
      projectTitle,
      region: row['Откуда']?.trim() || null,
      class: row['Класс']?.trim() || null,
      advChannelName: row['Куда звонил']?.trim() ?? '',
      billsec: 0,
      comment: row['Комментарий']?.trim() || null,
      redirectNumber: row['Вызов завершен']?.replace(/\D/g, '') || null,
      source: 'csv',
    })
  }

  let inserted = 0
  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    // Sync driver: yield the event loop between chunks so concurrent
    // requests are served during large imports
    if (i > 0) await new Promise(resolve => setImmediate(resolve))
    const chunk = records.slice(i, i + CHUNK_SIZE)
    const result = await db
      .insert(callImports)
      .values(chunk)
      .onConflictDoNothing()
      .returning({ id: sql<number>`1` })
    inserted += result.length
  }

  assertSkipRate(records.length, invalidCount)
  return { created: inserted, skipped: records.length - inserted }
}

// ---------------------------------------------------------------- dispatch

export const importers = {
  revenue: importRevenue,
  expenses: importExpenses,
  metrics: importMetrics,
  calls: importCalls,
} as const

export type ImportResource = keyof typeof importers

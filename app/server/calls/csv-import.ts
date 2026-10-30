import { and, eq } from 'drizzle-orm'

import { PROVIDER } from './gudok-webhook'

import { db } from '@/server/db'
import { assertCsvColumns, assertSkipRate, parseCsvBuffer } from '@/server/imports/csv'
import { calls, phoneNumbers } from '@/server/schema'

type CsvRow = Record<string, string>
type NumberMatch = { providerNumberId: string, siteId: number | null }

export interface CallsImportResult {
  created: number
  skipped: number
  disputed: number
  disputedCsv: string | null
}

const REASON_COLUMN = 'Причина'
const REASON = {
  invalid: 'Неверная строка',
  unknownNumber: 'Неизвестный номер',
  ambiguousNumber: 'Имя есть у нескольких номеров',
  noSite: 'У номера нет сайта',
  otherMinute: 'Тот же звонок записан с другим временем',
} as const

const CHUNK_SIZE = 1000
const MINUTE_MS = 60_000
// Moscow has stayed on UTC+3 since 2014, before the earliest Gudok export
const MOSCOW_OFFSET_MS = 3 * 60 * MINUTE_MS

/** Parse "31.12.25 12:05" as Moscow time, whatever the server's time zone. */
function parseMoscowDate(raw: string): Date | null {
  const match = raw.match(/^(\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/)
  if (!match) return null
  const [dd, mm, yy, hh, min] = match.slice(1).map(Number)
  const wall = new Date(Date.UTC(2000 + yy, mm - 1, dd, hh, min))
  // Date.UTC rolls over values like 31.02, so a changed field means a bad date
  const exists = wall.getUTCMonth() === mm - 1
    && wall.getUTCDate() === dd
    && wall.getUTCHours() === hh
    && wall.getUTCMinutes() === min
  return exists ? new Date(wall.getTime() - MOSCOW_OFFSET_MS) : null
}

function parseRow(row: CsvRow) {
  const date = parseMoscowDate(row['Дата'] ?? '')
  const src = row['Кто звонил']
  const callNumber = /^\d+$/.test(row['№'] ?? '') ? Number(row['№']) : null
  return date && src && callNumber !== null ? { date, src, callNumber } : null
}

async function loadNumbersByName(): Promise<Map<string, NumberMatch[]>> {
  const numbers = await db
    .select({
      name: phoneNumbers.name,
      providerNumberId: phoneNumbers.providerNumberId,
      siteId: phoneNumbers.siteId,
    })
    .from(phoneNumbers)
    .where(eq(phoneNumbers.provider, PROVIDER))

  const byName = new Map<string, NumberMatch[]>()
  for (const { name, ...match } of numbers) {
    if (name) byName.set(name, [...(byName.get(name) ?? []), match])
  }
  return byName
}

function resolveNumber(matches: NumberMatch[] | undefined) {
  if (!matches) return { problem: REASON.unknownNumber }
  if (matches.length > 1) return { problem: REASON.ambiguousNumber }
  const [{ providerNumberId, siteId }] = matches
  return siteId === null ? { problem: REASON.noSite } : { providerNumberId, siteId }
}

function toMinute(date: Date) {
  return Math.floor(date.getTime() / MINUTE_MS)
}

function csvCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}

/** BOM first, so Excel reads the Cyrillic correctly. */
function toDisputedCsv(rows: CsvRow[]) {
  const columns = Object.keys(rows[0])
  const lines = [columns, ...rows.map(row => columns.map(column => row[column]))]
  return `\uFEFF${lines.map(line => line.map(csvCell).join(',')).join('\r\n')}\r\n`
}

/**
 * Fill gaps from a Gudok export. Rows with no stored call on the key are
 * written, rows matching on key and minute are skipped, and all others are
 * handed back unwritten. Stored rows are never changed.
 */
export async function importCallsCsv(buffer: Buffer): Promise<CallsImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['Дата', 'Кто звонил', '№', 'Куда звонил'])

  const parsed = rows.map(row => ({ row, call: parseRow(row) }))
  const invalid = parsed.filter(({ call }) => !call).length
  // Before any write: a rejected file must leave the table as it was
  assertSkipRate(rows.length - invalid, invalid)

  const numbersByName = await loadNumbersByName()
  const disputed: CsvRow[] = []
  let created = 0
  let skipped = 0

  for (let i = 0; i < parsed.length; i += CHUNK_SIZE) {
    // Sync driver: yield the event loop between chunks so concurrent
    // requests are served during large imports
    if (i > 0) await new Promise(resolve => setImmediate(resolve))

    // One transaction per chunk: a webhook can't land between a check and its
    // write, and earlier rows of the file count as stored for later ones
    db.transaction(tx => {
      for (const { row, call } of parsed.slice(i, i + CHUNK_SIZE)) {
        if (!call) {
          disputed.push({ ...row, [REASON_COLUMN]: REASON.invalid })
          continue
        }

        const number = resolveNumber(numbersByName.get(row['Куда звонил']))
        if (number.problem) {
          disputed.push({ ...row, [REASON_COLUMN]: number.problem })
          continue
        }
        const { providerNumberId, siteId } = number

        const stored = tx
          .select({ date: calls.date })
          .from(calls)
          .where(and(
            eq(calls.siteId, siteId),
            eq(calls.src, call.src),
            eq(calls.callNumber, call.callNumber),
          ))
          .all()

        if (stored.some(({ date }) => toMinute(date) === toMinute(call.date))) {
          skipped++
        } else if (stored.length > 0) {
          disputed.push({ ...row, [REASON_COLUMN]: REASON.otherMinute })
        } else {
          tx.insert(calls).values({
            ...call,
            siteId,
            provider: PROVIDER,
            providerNumberId,
            source: 'csv',
            raw: JSON.stringify(row),
          }).run()
          created++
        }
      }
    })
  }

  return {
    created,
    skipped,
    disputed: disputed.length,
    disputedCsv: disputed.length > 0 ? toDisputedCsv(disputed) : null,
  }
}

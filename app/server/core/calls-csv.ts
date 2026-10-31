import type { CsvRow } from './csv'

type NumberMatch = { providerNumberId: string, siteId: number | null }

export const REASON_COLUMN = 'Причина'
export const REASON = {
  invalid: 'Неверная строка',
  unknownNumber: 'Неизвестный номер',
  ambiguousNumber: 'Имя есть у нескольких номеров',
  noSite: 'У номера нет сайта',
  otherMinute: 'Тот же звонок записан с другим временем',
} as const

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

export function parseCallRow(row: CsvRow) {
  const date = parseMoscowDate(row['Дата'] ?? '')
  const src = row['Кто звонил']
  const callNumber = /^\d+$/.test(row['№'] ?? '') ? Number(row['№']) : null
  return date && src && callNumber !== null ? { date, src, callNumber } : null
}

export function groupNumbersByName(
  numbers: (NumberMatch & { name: string | null })[],
): Map<string, NumberMatch[]> {
  const byName = new Map<string, NumberMatch[]>()
  for (const { name, ...match } of numbers) {
    if (name) byName.set(name, [...(byName.get(name) ?? []), match])
  }
  return byName
}

export function resolveNumber(matches: NumberMatch[] | undefined) {
  if (!matches) return { problem: REASON.unknownNumber }
  if (matches.length > 1) return { problem: REASON.ambiguousNumber }
  const [{ providerNumberId, siteId }] = matches
  return siteId === null ? { problem: REASON.noSite } : { providerNumberId, siteId }
}

function toMinute(date: Date) {
  return Math.floor(date.getTime() / MINUTE_MS)
}

/** Compares a row with the stored calls on its key, strictly to the minute. */
export function compareWithStored(date: Date, stored: { date: Date }[]) {
  if (stored.some(call => toMinute(call.date) === toMinute(date))) return 'duplicate'
  return stored.length > 0 ? 'otherMinute' : 'new'
}

function csvCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}

/** BOM first, so Excel reads the Cyrillic correctly. */
export function toDisputedCsv(rows: CsvRow[]) {
  const columns = Object.keys(rows[0])
  const lines = [columns, ...rows.map(row => columns.map(column => row[column]))]
  return `\uFEFF${lines.map(line => line.map(csvCell).join(',')).join('\r\n')}\r\n`
}

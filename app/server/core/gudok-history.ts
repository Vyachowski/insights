import { GudokPayloadError } from './gudok-calls'
import { isValidIsoDate } from './iso-date'
import { toKopecks } from './money'
import { resolveProjectTitle } from './site-matching'

// Telephony charges scraped from Gudok's /history (Операции) page. Only
// "Списание" (charge) rows are recorded, aggregated per (date, site) into one
// expense row of this type so re-posting the same days upserts instead of
// duplicating.
// Matches the existing expense category already loaded on prod (lowercase
// Latin), so the sync upserts against those rows instead of duplicating.
export const TELEPHONY_TYPE = 'telephony'
const CHARGE_KIND = 'Списание'
const KNOWN_KINDS = new Set([CHARGE_KIND, 'Пополнение', '-'])
const REPLY_FIELDS = ['created_at', 'project', 'kind_texted', 'amount'] as const
const REPLY_DATE = /^\d{2}\.\d{2}\.\d{4}$/
const REPLY_AMOUNT = /^-?\d{1,3}(?: \d{3})*,\d{3} i$/
const MISMATCHES_SHOWN = 3
const OLD_SCRIPT = 'Скрипт устарел: возьмите новый из scripts/gudok-telephony-console.js'
const ENTITIES: Record<string, string> = { 'amp': '&', 'lt': '<', 'gt': '>', 'quot': '"', '#39': "'", 'nbsp': ' ' }

export interface GudokOperationRow {
  id?: number | string
  date: string
  text?: string
  project?: string
  kind: string
  amount: string
}

/**
 * Parse a Gudok amount string into positive integer kopecks.
 * Gudok uses a comma decimal separator and a trailing ruble-icon, e.g.
 * `-870,000 i` → 87000. Returns null when unparseable.
 */
export function parseGudokAmountKopecks(raw: string): number | null {
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(',', '.')
  const value = parseFloat(cleaned)
  if (isNaN(value)) return null
  return toKopecks(Math.abs(value))
}

/** Parse a Gudok operation date (`DD.MM.YY[YY]` or ISO) into `YYYY-MM-DD`. */
export function parseGudokOperationDate(raw: string): string | null {
  const trimmed = raw.trim()
  const m = /^(\d{2})\.(\d{2})\.(\d{2}|\d{4})$/.exec(trimmed)
  if (m) {
    const [, dd, mm, year] = m
    const yyyy = year.length === 2 ? `20${year}` : year
    return `${yyyy}-${mm}-${dd}`
  }
  const date = new Date(trimmed)
  return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10)
}

const textOf = (html: string) => html
  .replace(/<[^>]*>/g, '')
  .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, name: string) => ENTITIES[name])
  .trim()

function gudokChanged(mismatches: string[]) {
  const shown = mismatches.slice(0, MISMATCHES_SHOWN).join('; ')
  const total = mismatches.length > MISMATCHES_SHOWN ? `; всего расхождений: ${mismatches.length}` : ''
  return new GudokPayloadError(`Гудок изменился: ${shown}${total}. Ничего не записано`)
}

function readReplyRow(raw: unknown, index: number) {
  const cells = (raw ?? {}) as Record<string, unknown>
  const label = `строка ${index + 1}`
  const missing = REPLY_FIELDS.filter(field => typeof cells[field] !== 'string')
  if (missing.length) return { mismatches: [`${label}: нет ${missing.join(', ')}`] }

  const [date, project, kind, amount] = REPLY_FIELDS.map(field => textOf(cells[field] as string))
  const mismatches = [
    ...(REPLY_DATE.test(date) && isValidIsoDate(parseGudokOperationDate(date) ?? '') ? [] : [`${label}: дата "${date}"`]),
    ...(REPLY_AMOUNT.test(amount) ? [] : [`${label}: сумма "${amount}"`]),
    ...(KNOWN_KINDS.has(kind) ? [] : [`${label}: неизвестный тип "${kind}"`]),
  ]
  const text = typeof cells.text === 'string' ? textOf(cells.text) : ''
  return { row: { date, text, project, kind, amount }, mismatches }
}

/**
 * Reads Gudok's `/history.json` reply into operation rows. Any row it cannot
 * read throws GudokPayloadError, because a skipped charge would look like a
 * period with no charge and lose the period's estimates.
 */
export function parseGudokReply(raw: unknown): GudokOperationRow[] {
  const { operations, recordsFiltered, data } = (raw ?? {}) as Record<string, unknown>
  if (operations !== undefined) throw new GudokPayloadError(OLD_SCRIPT)
  if (typeof recordsFiltered !== 'number' || !Array.isArray(data)) throw gudokChanged(['нет recordsFiltered или data'])
  // The history is never empty, so this is a request Gudok no longer understands
  if (data.length === 0) throw gudokChanged(['в ответе нет строк'])
  if (data.length !== recordsFiltered) throw gudokChanged([`пришло ${data.length} строк из ${recordsFiltered}`])

  const rows = data.map(readReplyRow)
  const mismatches = rows.flatMap(row => row.mismatches)
  if (mismatches.length) throw gudokChanged(mismatches)
  return rows.flatMap(({ row }) => row ?? [])
}

/** The rows dated inside the period, both ends included. */
export function rowsInPeriod(rows: GudokOperationRow[], { start, end }: { start: string, end: string }) {
  return rows.filter(row => {
    const date = parseGudokOperationDate(row.date)
    return date !== null && date >= start && date <= end
  })
}

/** Strip the trailing `..` decoration/truncation Gudok appends to project cells. */
export function cleanProject(raw: string): string {
  return raw.replace(/\.+$/, '').trim()
}

/**
 * Resolve a Gudok project (city) name to a siteId. Reuses the shared
 * project→city→site resolver; falls back to a unique prefix match so a
 * truncated long city name (e.g. `Ростов-На-Д..`) still resolves. Null when
 * unmatched or ambiguous.
 */
function resolveSite(map: Map<string, number>, project: string): number | null {
  const canonical = resolveProjectTitle(cleanProject(project))
  if (!canonical) return null
  const exact = map.get(canonical)
  if (exact != null) return exact
  const matches = [...map.keys()].filter(
    k => k.startsWith(canonical) || canonical.startsWith(k),
  )
  return matches.length === 1 ? (map.get(matches[0]) ?? null) : null
}

const toComment = (comments: string[]) => (comments.length
  ? `Гудок: ${comments.join('; ')}`
  : 'Гудок').slice(0, 1000)

/** Keeps only `Списание` rows and sums them per (date, resolved site). */
export function groupCharges(rows: GudokOperationRow[], cityToSiteId: Map<string, number>) {
  interface Group { date: string, siteId: number | null, amount: number, comments: string[] }
  const groups = new Map<string, Group>()

  for (const row of rows) {
    if ((row.kind ?? '').trim() !== CHARGE_KIND) continue
    const date = parseGudokOperationDate(row.date ?? '')
    const amount = parseGudokAmountKopecks(row.amount ?? '')
    if (!date || amount == null) continue
    const siteId = resolveSite(cityToSiteId, row.project ?? '')
    const key = `${date}::${siteId ?? 'null'}`
    const group = groups.get(key) ?? { date, siteId, amount: 0, comments: [] }
    group.amount += amount
    if (row.text?.trim()) group.comments.push(row.text.trim())
    groups.set(key, group)
  }

  return [...groups.values()].map(({ comments, ...group }) => ({
    ...group,
    type: TELEPHONY_TYPE,
    comment: toComment(comments),
  }))
}

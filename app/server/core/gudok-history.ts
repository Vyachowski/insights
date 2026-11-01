import { GudokPayloadError } from './gudok-calls'
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

const isDay = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const time = Date.parse(`${value}T00:00:00Z`)
  // The round trip refuses a day past the month's end, which parsing can roll over
  return !isNaN(time) && new Date(time).toISOString().startsWith(value)
}

/** The period a Gudok run covers. Throws GudokPayloadError when it is unusable. */
export function parseGudokPeriod(raw: unknown) {
  const { start, end } = (raw ?? {}) as { start?: unknown, end?: unknown }
  if (!isDay(start) || !isDay(end)) throw new GudokPayloadError('Invalid period date')
  if (start > end) throw new GudokPayloadError('Period start is after its end')
  return { start, end }
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

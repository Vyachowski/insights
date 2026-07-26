import { and, eq, isNull, max } from 'drizzle-orm'

import { loadCityToSiteId, resolveProjectTitle } from '@/server/calls/resolve-site'
import { db } from '@/server/db'
import { expenses } from '@/server/schema'

// Telephony charges scraped from Gudok's /history (Операции) page. Only
// "Списание" (charge) rows are recorded, aggregated per (date, site) into one
// expense row of this type so re-posting the same days upserts instead of
// duplicating. See openspec change sync-gudok-telephony-expenses.
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

export interface ExpenseIngestResult {
  created: number
  updated: number
  skipped: number
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
  return Math.round(Math.abs(value) * 100)
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

/**
 * Ingest Gudok operation rows as telephony expenses. Keeps only `Списание`
 * rows, groups them by (date, resolved site), sums the charges, and upserts a
 * single `telephony` expense per group (replacing the stored amount with the
 * freshly computed sum). Idempotent: re-posting the same days does not create
 * duplicates and keeps totals correct.
 */
export async function ingestGudokExpenses(
  rows: GudokOperationRow[],
): Promise<ExpenseIngestResult> {
  const map = await loadCityToSiteId()

  interface Group { date: string, siteId: number | null, amount: number, comments: string[] }
  const groups = new Map<string, Group>()

  for (const row of rows) {
    if ((row.kind ?? '').trim() !== CHARGE_KIND) continue
    const date = parseGudokOperationDate(row.date ?? '')
    const amount = parseGudokAmountKopecks(row.amount ?? '')
    if (!date || amount == null) continue
    const siteId = resolveSite(map, row.project ?? '')
    const key = `${date}::${siteId ?? 'null'}`
    const group = groups.get(key) ?? { date, siteId, amount: 0, comments: [] }
    group.amount += amount
    if (row.text?.trim()) group.comments.push(row.text.trim())
    groups.set(key, group)
  }

  let created = 0
  let updated = 0
  let skipped = 0

  for (const group of groups.values()) {
    const comment = (group.comments.length
      ? `Гудок: ${group.comments.join('; ')}`
      : 'Гудок').slice(0, 1000)

    const [existing] = await db
      .select({ id: expenses.id, amount: expenses.amount })
      .from(expenses)
      .where(and(
        eq(expenses.date, group.date),
        eq(expenses.type, TELEPHONY_TYPE),
        group.siteId === null
          ? isNull(expenses.siteId)
          : eq(expenses.siteId, group.siteId),
      ))
      .limit(1)

    if (existing && existing.amount === group.amount) {
      skipped++
    } else if (existing) {
      await db.update(expenses).set({ amount: group.amount, comment }).where(eq(expenses.id, existing.id))
      updated++
    } else {
      await db.insert(expenses).values({ date: group.date, siteId: group.siteId, amount: group.amount, type: TELEPHONY_TYPE, comment })
      created++
    }
  }

  return { created, updated, skipped }
}

/** Latest date (`YYYY-MM-DD`) for which a telephony expense exists, or null. */
export async function latestTelephonyDate(): Promise<string | null> {
  const [row] = await db
    .select({ d: max(expenses.date) })
    .from(expenses)
    .where(eq(expenses.type, TELEPHONY_TYPE))
  return row?.d ?? null
}

import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/server/db'
import { revenues } from '@/server/schema'
import { isUniqueViolation } from '@/server/sqlite-errors'

export interface UpsertRevenueInput {
  /** `YYYY-MM-DD` */
  date: string
  siteId: number | null
  /** integer kopecks */
  amount: number
}

export type UpsertRevenueOutcome = 'created' | 'updated' | 'skipped'

/**
 * Idempotent upsert of a single revenue row keyed by (date, siteId) — the same
 * matching used by CSV import and mirroring `upsertExpense`. Same amount is a
 * no-op; a different amount overwrites; otherwise a new row is inserted.
 */
export async function upsertRevenue({
  date,
  siteId,
  amount,
}: UpsertRevenueInput): Promise<UpsertRevenueOutcome> {
  const match = and(
    eq(revenues.date, date),
    siteId === null ? isNull(revenues.siteId) : eq(revenues.siteId, siteId),
  )

  const [existing] = await db
    .select({ id: revenues.id, amount: revenues.amount })
    .from(revenues)
    .where(match)
    .limit(1)

  if (existing && existing.amount === amount) return 'skipped'
  if (existing) {
    await db.update(revenues).set({ amount }).where(eq(revenues.id, existing.id))
    return 'updated'
  }
  try {
    await db.insert(revenues).values({ date, siteId, amount })
    return 'created'
  } catch (err) {
    if (!isUniqueViolation(err)) throw err
    // Lost an insert race against a concurrent add for the same (date, siteId);
    // a row exists now — overwrite its amount to stay idempotent.
    await db.update(revenues).set({ amount }).where(match)
    return 'updated'
  }
}

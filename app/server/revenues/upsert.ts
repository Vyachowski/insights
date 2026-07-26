import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/server/db'
import { revenues } from '@/server/schema'

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
  const [existing] = await db
    .select({ id: revenues.id, amount: revenues.amount })
    .from(revenues)
    .where(and(
      eq(revenues.date, date),
      siteId === null ? isNull(revenues.siteId) : eq(revenues.siteId, siteId),
    ))
    .limit(1)

  if (existing && existing.amount === amount) return 'skipped'
  if (existing) {
    await db.update(revenues).set({ amount }).where(eq(revenues.id, existing.id))
    return 'updated'
  }
  await db.insert(revenues).values({ date, siteId, amount })
  return 'created'
}

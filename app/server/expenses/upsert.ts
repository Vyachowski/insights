import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/server/db'
import { expenses } from '@/server/schema'

// Manual (non-import) expense category. Hosting is billed once a year per
// site; a single `hosting` expense per (date, siteId) mirrors the unique
// index on the table. Sits alongside TELEPHONY_TYPE in gudok-history.ts.
export const HOSTING_TYPE = 'hosting'

export interface UpsertExpenseInput {
  /** `YYYY-MM-DD` */
  date: string
  siteId: number | null
  type: string
  /** integer kopecks */
  amount: number
}

export type UpsertExpenseOutcome = 'created' | 'updated' | 'skipped'

/**
 * Idempotent upsert of a single expense keyed by (date, siteId, type) — the
 * same matching used by CSV import and the Gudok telephony ingest. Same amount
 * is a no-op; a different amount overwrites; otherwise a new row is inserted.
 */
export async function upsertExpense({
  date,
  siteId,
  type,
  amount,
}: UpsertExpenseInput): Promise<UpsertExpenseOutcome> {
  const [existing] = await db
    .select({ id: expenses.id, amount: expenses.amount })
    .from(expenses)
    .where(and(
      eq(expenses.date, date),
      eq(expenses.type, type),
      siteId === null ? isNull(expenses.siteId) : eq(expenses.siteId, siteId),
    ))
    .limit(1)

  if (existing && existing.amount === amount) return 'skipped'
  if (existing) {
    await db.update(expenses).set({ amount }).where(eq(expenses.id, existing.id))
    return 'updated'
  }
  await db.insert(expenses).values({ date, siteId, amount, type })
  return 'created'
}

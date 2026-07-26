import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/server/db'
import { expenses } from '@/server/schema'
import { isUniqueViolation } from '@/server/sqlite-errors'

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
  const match = and(
    eq(expenses.date, date),
    eq(expenses.type, type),
    siteId === null ? isNull(expenses.siteId) : eq(expenses.siteId, siteId),
  )

  const [existing] = await db
    .select({ id: expenses.id, amount: expenses.amount })
    .from(expenses)
    .where(match)
    .limit(1)

  if (existing && existing.amount === amount) return 'skipped'
  if (existing) {
    await db.update(expenses).set({ amount }).where(eq(expenses.id, existing.id))
    return 'updated'
  }
  try {
    await db.insert(expenses).values({ date, siteId, amount, type })
    return 'created'
  } catch (err) {
    if (!isUniqueViolation(err)) throw err
    // Lost an insert race against a concurrent add for the same (date, siteId,
    // type); a row exists now — overwrite its amount to stay idempotent.
    await db.update(expenses).set({ amount }).where(match)
    return 'updated'
  }
}

import { and, eq, isNull, max } from 'drizzle-orm'

import { db } from '../client'
import { expenses } from '../schema'
import { isUniqueViolation } from './sqlite-errors'

export type Expense = typeof expenses.$inferSelect

export interface UpsertExpenseInput {
  /** `YYYY-MM-DD` */
  date: string
  siteId: number | null
  type: string
  /** integer kopecks */
  amount: number
  /** Left as stored when omitted */
  comment?: string
}

export type UpsertExpenseOutcome = 'created' | 'updated' | 'skipped'

export function listExpenses() {
  return db.select().from(expenses).orderBy(expenses.id)
}

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
  comment,
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
    await db.update(expenses).set({ amount, comment }).where(eq(expenses.id, existing.id))
    return 'updated'
  }
  try {
    await db.insert(expenses).values({ date, siteId, amount, type, comment })
    return 'created'
  } catch (err) {
    if (!isUniqueViolation(err)) throw err
    // Lost an insert race against a concurrent add for the same (date, siteId,
    // type); a row exists now — overwrite its amount to stay idempotent.
    await db.update(expenses).set({ amount, comment }).where(match)
    return 'updated'
  }
}

/** Latest date (`YYYY-MM-DD`) of an expense of this type, or null. */
export async function latestExpenseDate(type: string): Promise<string | null> {
  const [row] = await db
    .select({ d: max(expenses.date) })
    .from(expenses)
    .where(eq(expenses.type, type))
  return row?.d ?? null
}

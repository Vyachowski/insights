import { and, eq, isNull, max, sql } from 'drizzle-orm'

import { db } from '../client'
import { expenses } from '../schema'
import { isUniqueViolation } from './sqlite-errors'

import type { Tx } from '../transaction'

export type Expense = typeof expenses.$inferSelect

export interface UpsertExpenseInput {
  /** `YYYY-MM-DD` */
  date: string
  siteId: number | null
  type: string
  /** integer kopecks */
  amount: number
  /** Left as stored when omitted, except that an estimate's comment is cleared */
  comment?: string
}

export type UpsertExpenseOutcome = 'created' | 'updated' | 'skipped'

/** The `CASE` reads the row as it was before the write. */
const realWrite = (amount: number, comment?: string) => ({
  amount,
  comment: comment ?? sql`CASE WHEN ${expenses.isEstimate} THEN NULL ELSE ${expenses.comment} END`,
  isEstimate: false,
})

export function listExpenses() {
  return db.select().from(expenses).orderBy(expenses.id)
}

/**
 * Idempotent upsert of a single expense keyed by (date, siteId, type) — the
 * same matching used by CSV import and the Gudok telephony ingest. Same amount
 * is a no-op; a different amount overwrites; otherwise a new row is inserted.
 * Every write here is real: over an estimate it overwrites and clears the mark,
 * even at the same amount. Synchronous, so it can run inside a transaction.
 */
export function writeRealExpense(
  writer: Pick<Tx, 'select' | 'insert' | 'update'>,
  { date, siteId, type, amount, comment }: UpsertExpenseInput,
): UpsertExpenseOutcome {
  const match = and(
    eq(expenses.date, date),
    eq(expenses.type, type),
    siteId === null ? isNull(expenses.siteId) : eq(expenses.siteId, siteId),
  )

  const existing = writer
    .select({ id: expenses.id, amount: expenses.amount, isEstimate: expenses.isEstimate })
    .from(expenses)
    .where(match)
    .limit(1)
    .get()

  if (existing && existing.amount === amount && !existing.isEstimate) return 'skipped'
  if (existing) {
    writer.update(expenses).set(realWrite(amount, comment)).where(eq(expenses.id, existing.id)).run()
    return 'updated'
  }
  try {
    writer.insert(expenses).values({ date, siteId, amount, type, comment }).run()
    return 'created'
  } catch (err) {
    if (!isUniqueViolation(err)) throw err
    // Lost an insert race against a concurrent add for the same (date, siteId,
    // type); a row exists now — overwrite its amount to stay idempotent.
    writer.update(expenses).set(realWrite(amount, comment)).where(match).run()
    return 'updated'
  }
}

export async function upsertExpense(input: UpsertExpenseInput): Promise<UpsertExpenseOutcome> {
  return writeRealExpense(db, input)
}

/** Writes an estimate unless the key is taken, so a stored row never changes. */
export function insertEstimate(tx: Tx, row: Required<Omit<UpsertExpenseInput, 'comment'>>): boolean {
  return tx.insert(expenses).values({ ...row, isEstimate: true }).onConflictDoNothing().run().changes > 0
}

/** Latest date (`YYYY-MM-DD`) of an expense of this type, or null. */
export async function latestExpenseDate(type: string): Promise<string | null> {
  const [row] = await db
    .select({ d: max(expenses.date) })
    .from(expenses)
    .where(eq(expenses.type, type))
  return row?.d ?? null
}

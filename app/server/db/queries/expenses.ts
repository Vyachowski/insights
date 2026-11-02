import { and, between, eq, isNotNull, isNull, max, min, sql } from 'drizzle-orm'

import { db } from '../client'
import { expenses } from '../schema'
import { isUniqueViolation } from '../unique-violation'

import type { Tx } from '../transaction'
import type { UpsertOutcome } from '../upsert-outcome'
import type { DayPeriod } from './period'

export type Expense = typeof expenses.$inferSelect

export interface UpsertExpenseInput {
  /** `YYYY-MM-DD` */
  date: string
  siteId: number | null
  /** With a hosting the key is (date, hostingId), and the row has no site */
  hostingId?: number
  type: string
  /** integer kopecks */
  amount: number
  /** Left as stored when omitted, except that an estimate's comment is cleared */
  comment?: string
}

/** The `CASE` reads the row as it was before the write. */
const realWrite = (amount: number, comment?: string) => ({
  amount,
  comment: comment ?? sql`CASE WHEN ${expenses.isEstimate} THEN NULL ELSE ${expenses.comment} END`,
  isEstimate: false,
})

/** A row an expense CSV writes: no site and no hosting. The company-level index holds one per date. */
const unlinkedRow = (date: string, type: string) => and(
  eq(expenses.date, date),
  eq(expenses.type, type),
  isNull(expenses.siteId),
  isNull(expenses.hostingId),
)

export function listExpenses() {
  return db.select().from(expenses).orderBy(expenses.id)
}

/**
 * Idempotent upsert of a single expense keyed by (date, siteId, type) — the
 * same matching used by CSV import and the Gudok telephony ingest. Same amount
 * is a no-op; a different amount overwrites; otherwise a new row is inserted.
 * With no hosting a write on (date, no site, 'hosting') still matches a linked
 * row, so an old CSV adds no second row. A write with a hosting and no row of
 * its own takes over a row with no hosting, so the reverse order adds none
 * either. Every write here is real: over an estimate it overwrites and clears the mark,
 * even at the same amount. Synchronous, so it can run inside a transaction.
 */
export function writeRealExpense(
  writer: Pick<Tx, 'select' | 'insert' | 'update'>,
  { date, siteId, hostingId, type, amount, comment }: UpsertExpenseInput,
): UpsertOutcome {
  const match = hostingId === undefined
    ? and(
      eq(expenses.date, date),
      eq(expenses.type, type),
      siteId === null ? isNull(expenses.siteId) : eq(expenses.siteId, siteId),
    )
    : and(eq(expenses.date, date), eq(expenses.hostingId, hostingId))

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
  if (hostingId !== undefined) {
    const { changes } = writer
      .update(expenses)
      .set({ ...realWrite(amount, comment), hostingId })
      .where(unlinkedRow(date, type))
      .run()
    if (changes > 0) return 'updated'
  }
  try {
    writer.insert(expenses).values({ date, siteId, hostingId, amount, type, comment }).run()
    return 'created'
  } catch (err) {
    if (!isUniqueViolation(err)) throw err
    // Lost an insert race against a concurrent add on the same key; a row
    // exists now — overwrite its amount to stay idempotent.
    writer.update(expenses).set(realWrite(amount, comment)).where(match).run()
    return 'updated'
  }
}

export async function upsertExpense(input: UpsertExpenseInput): Promise<UpsertOutcome> {
  return writeRealExpense(db, input)
}

/** Writes an estimate unless the key is taken, so a stored row never changes. */
export function insertEstimate(tx: Tx, row: Required<Omit<UpsertExpenseInput, 'comment' | 'hostingId'>>): boolean {
  return tx.insert(expenses).values({ ...row, isEstimate: true }).onConflictDoNothing().run().changes > 0
}

/**
 * Writes a real hosting charge unless the key is taken, so a stored row never
 * changes. A row with no hosting on the date takes the key too, so the same
 * charge from a CSV does not count twice.
 */
export function insertHostingCharge(
  tx: Tx,
  row: { date: string, hostingId: number, amount: number, type: string },
): boolean {
  if (tx.select({ id: expenses.id }).from(expenses).where(unlinkedRow(row.date, row.type)).get()) return false
  return tx.insert(expenses).values(row).onConflictDoNothing().run().changes > 0
}

/** Deletes the estimates dated inside the period and returns the site of each. */
export function deleteEstimates(tx: Tx, type: string, { start, end }: DayPeriod) {
  return tx
    .delete(expenses)
    .where(and(eq(expenses.type, type), eq(expenses.isEstimate, true), between(expenses.date, start, end)))
    .returning({ siteId: expenses.siteId })
    .all()
}

const realSiteRows = (type: string) => and(
  eq(expenses.type, type),
  eq(expenses.isEstimate, false),
  isNotNull(expenses.siteId),
)

/** Sites with a real expense of this type dated inside the period. */
export function listChargedSites(tx: Tx, type: string, { start, end }: DayPeriod) {
  return tx
    .selectDistinct({ siteId: expenses.siteId })
    .from(expenses)
    .where(and(realSiteRows(type), between(expenses.date, start, end)))
    .all()
}

/** The latest real expense of this type per site. */
export function listLastCharges(tx: Tx, type: string) {
  return tx
    // SQLite takes the bare `amount` from the row that holds max(date)
    .select({ siteId: expenses.siteId, date: sql<string>`max(${expenses.date})`, amount: expenses.amount })
    .from(expenses)
    .where(realSiteRows(type))
    .groupBy(expenses.siteId)
    .all()
}

/** The latest row per hosting. */
export function listLastHostingCharges(tx: Tx) {
  return tx
    // SQLite takes the bare `amount` from the row that holds max(date)
    .select({ hostingId: expenses.hostingId, date: sql<string>`max(${expenses.date})`, amount: expenses.amount })
    .from(expenses)
    .where(isNotNull(expenses.hostingId))
    .groupBy(expenses.hostingId)
    .all()
}

/** Oldest date (`YYYY-MM-DD`) of an estimate of this type, or null. */
export function oldestEstimateDate(tx: Tx, type: string): string | null {
  const row = tx
    .select({ d: min(expenses.date) })
    .from(expenses)
    .where(and(eq(expenses.type, type), eq(expenses.isEstimate, true)))
    .get()
  return row?.d ?? null
}

/** Latest date (`YYYY-MM-DD`) of an expense of this type, or null. */
export function latestExpenseDate(tx: Tx, type: string): string | null {
  const row = tx
    .select({ d: max(expenses.date) })
    .from(expenses)
    .where(eq(expenses.type, type))
    .get()
  return row?.d ?? null
}

/** Latest date (`YYYY-MM-DD`) of a real expense of this type, or null. */
export async function latestRealExpenseDate(type: string): Promise<string | null> {
  const [row] = await db
    .select({ d: max(expenses.date) })
    .from(expenses)
    .where(and(eq(expenses.type, type), eq(expenses.isEstimate, false)))
  return row?.d ?? null
}

import { groupCharges, type GudokOperationRow, TELEPHONY_TYPE } from '@/server/core/gudok-history'
import { toCityToSiteId } from '@/server/core/site-matching'
import { latestExpenseDate, writeRealExpense } from '@/server/db/queries/expenses'
import { listSiteCities } from '@/server/db/queries/sites'
import { transaction, type Tx } from '@/server/db/transaction'

export type { GudokOperationRow }

export interface ExpenseIngestResult {
  created: number
  updated: number
  skipped: number
}

/** The ingest's writes, for an operation that holds its own transaction. */
export function writeGudokExpenses(
  tx: Tx,
  rows: GudokOperationRow[],
  cityToSiteId: Map<string, number>,
): ExpenseIngestResult {
  const result = { created: 0, updated: 0, skipped: 0 }
  for (const charge of groupCharges(rows, cityToSiteId)) result[writeRealExpense(tx, charge)]++
  return result
}

/**
 * Ingest Gudok operation rows as telephony expenses: one `telephony` expense
 * per (date, site), replacing the stored amount with the freshly computed sum.
 * Idempotent: re-posting the same days does not create duplicates and keeps
 * totals correct.
 */
export async function ingestGudokExpenses(
  rows: GudokOperationRow[],
): Promise<ExpenseIngestResult> {
  const cityToSiteId = toCityToSiteId(await listSiteCities())
  return transaction(tx => writeGudokExpenses(tx, rows, cityToSiteId))
}

/** Latest date (`YYYY-MM-DD`) for which a telephony expense exists, or null. */
export function latestTelephonyDate(): Promise<string | null> {
  return latestExpenseDate(TELEPHONY_TYPE)
}

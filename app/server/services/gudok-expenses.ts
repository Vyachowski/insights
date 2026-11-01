import { groupCharges, type GudokOperationRow, TELEPHONY_TYPE } from '@/server/core/gudok-history'
import { latestExpenseDate, oldestEstimateDate, writeRealExpense } from '@/server/db/queries/expenses'
import { transaction, type Tx } from '@/server/db/transaction'

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
 * The day a Gudok run must reach: the oldest telephony estimate, or the latest
 * stored day when no estimates exist. The latest day alone would stop the run
 * going back to the estimates. Null when nothing is stored.
 */
export function telephonySince(): string | null {
  return transaction(tx => oldestEstimateDate(tx, TELEPHONY_TYPE) ?? latestExpenseDate(tx, TELEPHONY_TYPE))
}

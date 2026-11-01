import { GudokPayloadError } from '@/server/core/gudok-calls'
import { groupCharges, type GudokOperationRow, TELEPHONY_TYPE } from '@/server/core/gudok-history'
import { toCityToSiteId } from '@/server/core/site-matching'
import { latestExpenseDate, oldestEstimateDate, writeRealExpense } from '@/server/db/queries/expenses'
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
 * totals correct. Refused while estimates exist: with no period to clear them,
 * a real charge on another date would sit beside one.
 */
export async function ingestGudokExpenses(
  rows: GudokOperationRow[],
): Promise<ExpenseIngestResult> {
  const cityToSiteId = toCityToSiteId(await listSiteCities())
  return transaction(tx => {
    if (oldestEstimateDate(tx, TELEPHONY_TYPE)) {
      throw new GudokPayloadError('Period required while estimates exist: update the bookmarklet')
    }
    return writeGudokExpenses(tx, rows, cityToSiteId)
  })
}

/**
 * The day a Gudok run must reach: the oldest telephony estimate, or the latest
 * stored day when no estimates exist. The latest day alone would stop the
 * bookmarklet going back to the estimates. Null when nothing is stored.
 */
export function telephonySince(): string | null {
  return transaction(tx => oldestEstimateDate(tx, TELEPHONY_TYPE) ?? latestExpenseDate(tx, TELEPHONY_TYPE))
}

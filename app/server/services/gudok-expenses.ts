import { groupCharges, type GudokOperationRow, TELEPHONY_TYPE } from '@/server/core/gudok-history'
import { latestExpenseDate, upsertExpense } from '@/server/db/expenses'
import { loadCityToSiteId } from '@/server/db/sites'

export type { GudokOperationRow }

export interface ExpenseIngestResult {
  created: number
  updated: number
  skipped: number
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
  const charges = groupCharges(rows, await loadCityToSiteId())

  const result = { created: 0, updated: 0, skipped: 0 }
  for (const charge of charges) result[await upsertExpense(charge)]++
  return result
}

/** Latest date (`YYYY-MM-DD`) for which a telephony expense exists, or null. */
export function latestTelephonyDate(): Promise<string | null> {
  return latestExpenseDate(TELEPHONY_TYPE)
}

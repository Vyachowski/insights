import { desc } from 'drizzle-orm'

import { db } from '../client'
import { reconciliationRuns } from '../schema'

import type { Tx } from '../transaction'
import type { DayPeriod } from './period'

export function insertReconciliationRun(tx: Tx, { start, end }: DayPeriod): void {
  tx.insert(reconciliationRuns).values({ periodStart: start, periodEnd: end }).run()
}

/** End (`YYYY-MM-DD`) of the period of the last recorded run, or null. */
export async function lastRunPeriodEnd(): Promise<string | null> {
  const [row] = await db
    .select({ periodEnd: reconciliationRuns.periodEnd })
    .from(reconciliationRuns)
    .orderBy(desc(reconciliationRuns.id))
    .limit(1)
  return row?.periodEnd ?? null
}

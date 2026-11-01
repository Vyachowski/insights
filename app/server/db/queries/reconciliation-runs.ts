import { reconciliationRuns } from '../schema'

import type { Tx } from '../transaction'
import type { DayPeriod } from './period'

export function insertReconciliationRun(tx: Tx, { start, end }: DayPeriod): void {
  tx.insert(reconciliationRuns).values({ periodStart: start, periodEnd: end }).run()
}

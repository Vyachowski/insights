import { writeGudokExpenses } from './gudok-expenses'

import type { DayPeriod } from '@/server/db/queries/period'

import { reconciledSchedule } from '@/server/core/auto-charges'
import { type GudokOperationRow, TELEPHONY_TYPE } from '@/server/core/gudok-history'
import { toCityToSiteId } from '@/server/core/site-matching'
import { listEnabledSchedules, updateSchedule } from '@/server/db/queries/charge-schedules'
import { deleteEstimates, listChargedSites, listLastCharges } from '@/server/db/queries/expenses'
import { insertReconciliationRun } from '@/server/db/queries/reconciliation-runs'
import { listSiteCities } from '@/server/db/queries/sites'
import { transaction } from '@/server/db/transaction'

/**
 * Makes a period exact from the Gudok rows that cover it, in one transaction:
 * a failed run changes nothing. Estimates go first, so a real charge on another
 * date cannot sit beside one. Disabled schedules are left alone.
 */
export async function reconcileTelephony(rows: GudokOperationRow[], period: DayPeriod) {
  const cityToSiteId = toCityToSiteId(await listSiteCities())

  return transaction(tx => {
    const deleted = deleteEstimates(tx, TELEPHONY_TYPE, period)
    const written = writeGudokExpenses(tx, rows, cityToSiteId)

    const estimatedSites = new Set(deleted.map(({ siteId }) => siteId))
    const chargedSites = new Set(listChargedSites(tx, TELEPHONY_TYPE, period).map(({ siteId }) => siteId))
    const lastCharges = new Map(listLastCharges(tx, TELEPHONY_TYPE).map(({ siteId, ...charge }) => [siteId, charge]))

    for (const { id, siteId, ...schedule } of listEnabledSchedules(tx)) {
      updateSchedule(tx, id, reconciledSchedule(schedule, {
        lastCharge: lastCharges.get(siteId),
        estimated: siteId !== null && estimatedSites.has(siteId),
        charged: chargedSites.has(siteId),
        periodEnd: period.end,
      }))
    }

    insertReconciliationRun(tx, period)
    return { ...written, deletedEstimates: deleted.length }
  })
}

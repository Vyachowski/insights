import { ingestGudokExpenses, writeGudokExpenses } from './gudok-expenses'

import type { DayPeriod } from '@/server/db/queries/period'

import { isReconciliationStale, moscowDay, reconciledSchedule } from '@/server/core/auto-charges'
import { GudokPayloadError } from '@/server/core/gudok-calls'
import { type GudokOperationRow, parseGudokPeriod, TELEPHONY_TYPE } from '@/server/core/gudok-history'
import { toCityToSiteId } from '@/server/core/site-matching'
import { listEnabledSchedules, updateSchedule } from '@/server/db/queries/charge-schedules'
import {
  deleteEstimates,
  latestRealExpenseDate,
  listChargedSites,
  listLastCharges,
  oldestEstimateDate,
} from '@/server/db/queries/expenses'
import { insertReconciliationRun, lastRunPeriodEnd } from '@/server/db/queries/reconciliation-runs'
import { listSiteCities } from '@/server/db/queries/sites'
import { transaction } from '@/server/db/transaction'

export { GudokPayloadError }

/** The dates that say how far telephony expenses are exact. */
export async function readReconciliationDates() {
  const [lastRunEnd, lastRealDay] = await Promise.all([
    lastRunPeriodEnd(),
    latestRealExpenseDate(TELEPHONY_TYPE),
  ])
  return { lastRunEnd, lastRealDay }
}

/** Whether the admin should run the bookmarklet: estimates wait for a check past the limit. */
export async function checkReconciliationStale(now = new Date()) {
  const hasEstimates = transaction(tx => oldestEstimateDate(tx, TELEPHONY_TYPE)) !== null
  return isReconciliationStale(await readReconciliationDates(), { hasEstimates, today: moscowDay(now) })
}

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

/**
 * One bookmarklet post: with a period it is a reconciliation run, and without
 * one it is a plain ingest. Throws GudokPayloadError on a post it must refuse.
 */
export async function receiveGudokPost(rows: GudokOperationRow[], period: unknown) {
  return period === undefined ? ingestGudokExpenses(rows) : reconcileTelephony(rows, parseGudokPeriod(period))
}

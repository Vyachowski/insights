import { telephonySince, writeGudokExpenses } from './gudok-expenses'

import type { DayPeriod } from '@/server/db/queries/period'

import { addDays, moscowDay } from '@/server/core/auto-charges'
import { GudokPayloadError } from '@/server/core/gudok-calls'
import { type GudokOperationRow, parseGudokReply, rowsInPeriod, TELEPHONY_TYPE } from '@/server/core/gudok-history'
import { isReconciliationStale, reconciledSchedule } from '@/server/core/reconciliation'
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

const FIRST_RUN_DAYS = 90

/** The dates that say how far telephony expenses are exact. */
export async function readReconciliationDates() {
  const [lastRunEnd, lastRealDay] = await Promise.all([
    lastRunPeriodEnd(),
    latestRealExpenseDate(TELEPHONY_TYPE),
  ])
  return { lastRunEnd, lastRealDay }
}

/** Whether the admin should run the console script: estimates wait for a check past the limit. */
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
 * One run on Gudok's whole history: the server picks the period, so a script
 * cannot post one that loses estimates. Throws GudokPayloadError and writes
 * nothing when the reply does not match.
 */
export async function receiveGudokReply(reply: unknown, now = new Date()) {
  const rows = parseGudokReply(reply)
  const end = moscowDay(now)
  const since = telephonySince() ?? addDays(end, -FIRST_RUN_DAYS)
  // A row entered with a future date must not turn the period over
  const period = { start: since < end ? since : end, end }
  return { ...await reconcileTelephony(rowsInPeriod(rows, period), period), period }
}

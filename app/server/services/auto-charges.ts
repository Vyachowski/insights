import { chargesDue, moscowDay } from '@/server/core/auto-charges'
import { TELEPHONY_TYPE } from '@/server/core/gudok-history'
import { listActiveSchedules, setNextChargeDate } from '@/server/db/queries/charge-schedules'
import { insertEstimate } from '@/server/db/queries/expenses'
import { transaction } from '@/server/db/transaction'

/**
 * Writes an estimated telephony charge for every date due up to today in one
 * transaction, so a failed check writes nothing and the next one repeats it.
 */
export function writeDueEstimates() {
  const today = moscowDay(new Date())

  return transaction(tx => {
    const schedules = listActiveSchedules(tx)
    let written = 0
    for (const { id, siteId, amount, ...schedule } of schedules) {
      const { dates, nextDate } = chargesDue(schedule, today)
      if (dates.length === 0) continue

      for (const date of dates) {
        if (insertEstimate(tx, { date, siteId, amount, type: TELEPHONY_TYPE })) written++
      }
      setNextChargeDate(tx, id, nextDate)
    }
    return { checked: schedules.length, written }
  })
}

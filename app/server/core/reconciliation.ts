import { addDays } from './auto-charges'

const RECONCILIATION_MAX_AGE_DAYS = 90

/**
 * A schedule after a Gudok run: the next date and amount follow the site's last
 * real charge, and with no real charge at all they stay. `noChargePeriodEnd` is
 * set when an estimate in the period had no real charge to back it, and only a
 * real charge in the period clears it, so a repeated or short run leaves it.
 */
export function reconciledSchedule(
  schedule: { nextDate: string, amount: number, intervalDays: number, noChargePeriodEnd: string | null },
  { lastCharge, estimated, charged, periodEnd }: {
    lastCharge?: { date: string, amount: number }
    estimated: boolean
    charged: boolean
    periodEnd: string
  },
) {
  return {
    nextDate: lastCharge ? addDays(lastCharge.date, schedule.intervalDays) : schedule.nextDate,
    amount: lastCharge?.amount ?? schedule.amount,
    noChargePeriodEnd: charged ? null : estimated ? periodEnd : schedule.noChargePeriodEnd,
  }
}

/** The dates that say how far expenses are exact, `YYYY-MM-DD` or null. */
export interface ReconciliationDates {
  lastRunEnd: string | null
  lastRealDay: string | null
}

// The log starts after the first Gudok runs, so older runs leave only their rows
export const reconciledUntil = ({ lastRunEnd, lastRealDay }: ReconciliationDates) => lastRunEnd ?? lastRealDay

/** Estimates wait for a check past the limit. With no date there is no age to measure. */
export function isReconciliationStale(
  dates: ReconciliationDates,
  { hasEstimates, today }: { hasEstimates: boolean, today: string },
) {
  const until = reconciledUntil(dates)
  return hasEstimates && until !== null && addDays(until, RECONCILIATION_MAX_AGE_DAYS) < today
}

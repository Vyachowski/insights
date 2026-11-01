import { isValidIsoDate } from './finance'
import { toKopecks, toRubles } from './money'

const DAY_MS = 24 * 60 * 60 * 1000

// Charges repeat every 30 days, not monthly. Same as the column default
const DEFAULT_INTERVAL_DAYS = 30

const MOSCOW_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Moscow',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** The `Europe/Moscow` day of `now` as `YYYY-MM-DD`, on any server. */
export const moscowDay = (now: Date): string => MOSCOW_DATE.format(now)

// In UTC, so a daylight saving change on the server cannot shift a date
const addDays = (date: string, days: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)

/** Every date owed up to `today`, and the first next date past it. */
export function chargesDue(
  schedule: { nextDate: string, intervalDays: number },
  today: string,
) {
  if (schedule.intervalDays < 1) throw new RangeError(`Bad charge interval: ${schedule.intervalDays}`)

  const dates: string[] = []
  let date = schedule.nextDate
  while (date <= today) {
    dates.push(date)
    date = addDays(date, schedule.intervalDays)
  }
  return { dates, nextDate: date }
}

/**
 * A schedule after a Gudok run: the next date and amount follow the site's last
 * real charge, and with no real charge at all they stay. `noChargePeriodEnd` is
 * set only when an estimate in the period had no real charge to back it.
 */
export function reconciledSchedule(
  schedule: { nextDate: string, amount: number, intervalDays: number },
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
    noChargePeriodEnd: estimated && !charged ? periodEnd : null,
  }
}

/**
 * A number as `Номера` shows it: one that is off has no next charge, and the
 * amount is in rubles. `offer` comes from the site's last real charge and never
 * from stored values, so switching on again starts fresh.
 */
export function numberCharge<T extends {
  enabled: boolean | null
  nextDate: string | null
  amount: number | null
}>(row: T, lastCharge?: { date: string, amount: number }) {
  const enabled = row.enabled === true
  return {
    ...row,
    enabled,
    nextDate: enabled ? row.nextDate : null,
    amount: enabled && row.amount !== null ? toRubles(row.amount) : null,
    offer: lastCharge
      ? { nextDate: addDays(lastCharge.date, DEFAULT_INTERVAL_DAYS), amount: toRubles(lastCharge.amount) }
      : null,
  }
}

/** `chargesDue` throws below 1, and one bad schedule would stop every estimate. */
export const isValidInterval = (days: number) => Number.isInteger(days) && days >= 1

/** The next date and amount in kopecks from the form, or what is wrong with them. */
export function parseScheduleForm(
  form: Record<string, FormDataEntryValue | undefined>,
): { error: string } | { nextDate: string, amount: number } {
  const nextDate = String(form.nextDate ?? '')
  if (!isValidIsoDate(nextDate)) return { error: 'Укажите дату' }

  // Checked in kopecks, so an amount that rounds down to zero is refused too
  const amount = toKopecks(Number(form.amount))
  if (!Number.isSafeInteger(amount) || amount <= 0) return { error: 'Укажите сумму больше нуля' }

  return { nextDate, amount }
}

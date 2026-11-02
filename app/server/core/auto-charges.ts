import { isValidIsoDate } from './finance'
import { toKopecks, toRubles } from './money'

const DAY_MS = 24 * 60 * 60 * 1000

// Charges repeat every 30 days, not monthly. Same as the column default
const DEFAULT_INTERVAL_DAYS = 30
export const HOSTING_INTERVAL_MONTHS = 12

const MOSCOW_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Moscow',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** The `Europe/Moscow` day of `now` as `YYYY-MM-DD`, on any server. */
export const moscowDay = (now: Date): string => MOSCOW_DATE.format(now)

// In UTC, so a daylight saving change on the server cannot shift a date
export const addDays = (date: string, days: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)

/** A date keeps its day, and in a month too short for it falls on the last day. */
function addMonths(date: string, months: number) {
  const next = new Date(`${date}T00:00:00Z`)
  const day = next.getUTCDate()
  next.setUTCMonth(next.getUTCMonth() + months)
  // A missing day rolls into the month after, so step back to the end of the wanted one
  if (next.getUTCDate() !== day) next.setUTCDate(0)
  return next.toISOString().slice(0, 10)
}

type ChargeInterval = { intervalDays: number } | { intervalMonths: number }

/** Every date owed up to `today`, and the first next date past it. */
export function chargesDue(schedule: { nextDate: string } & ChargeInterval, today: string) {
  const [interval, step] = 'intervalDays' in schedule
    ? [schedule.intervalDays, addDays]
    : [schedule.intervalMonths, addMonths]
  if (interval < 1) throw new RangeError(`Bad charge interval: ${interval}`)

  const dates: string[] = []
  let date = schedule.nextDate
  while (date <= today) {
    dates.push(date)
    date = step(date, interval)
  }
  return { dates, nextDate: date }
}

interface StoredCharge {
  enabled: boolean | null
  nextDate: string | null
  amount: number | null
}

interface LastCharge {
  date: string
  amount: number
}

/**
 * A charge as its tab shows it: one that is off has no next date and no amount,
 * and the amount is in rubles. `offer` comes from the last charge and never from
 * stored values, so switching on again starts fresh.
 */
function shownCharge<T extends StoredCharge>(row: T, step: (date: string) => string, lastCharge?: LastCharge) {
  const enabled = row.enabled === true
  return {
    ...row,
    enabled,
    nextDate: enabled ? row.nextDate : null,
    amount: enabled && row.amount !== null ? toRubles(row.amount) : null,
    offer: lastCharge ? { nextDate: step(lastCharge.date), amount: toRubles(lastCharge.amount) } : null,
  }
}

/** A number as `Номера` shows it. One that is off has no no-charge mark. */
export function numberCharge<T extends StoredCharge & { noChargePeriodEnd: string | null }>(
  row: T,
  lastCharge?: LastCharge,
) {
  const shown = shownCharge(row, date => addDays(date, DEFAULT_INTERVAL_DAYS), lastCharge)
  return { ...shown, noChargePeriodEnd: shown.enabled ? row.noChargePeriodEnd : null }
}

/** A hosting as `Хостинг` shows it. */
export const hostingCharge = <T extends StoredCharge>(row: T, lastCharge?: LastCharge) =>
  shownCharge(row, date => addMonths(date, HOSTING_INTERVAL_MONTHS), lastCharge)

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

const DAY_MS = 24 * 60 * 60 * 1000

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

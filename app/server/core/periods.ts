import { startOfYear, subYears } from 'date-fns'

/** This year from January 1 to `now`, and the same window of last year. */
export function getComparablePeriods(now: Date) {
  const currentStart = startOfYear(now)

  return {
    currentYear: { start: currentStart, end: now },
    previousYear: { start: subYears(currentStart, 1), end: subYears(now, 1) },
  }
}

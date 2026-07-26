import { useMemo, useState } from 'react'

export function usePeriodFilter<T extends { date: string | Date }>(entries: T[]) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const availableYears = useMemo(
    () =>
      [...new Set(entries.map(e => new Date(e.date).getFullYear()))].sort(
        (a, b) => b - a,
      ),
    [entries],
  )
  const effectiveYear = selectedYear ?? availableYears[0] ?? null

  const availableMonths = useMemo(
    () =>
      effectiveYear === null
        ? []
        : [
          ...new Set(
            entries
              .filter(e => new Date(e.date).getFullYear() === effectiveYear)
              .map(e => new Date(e.date).getMonth()),
          ),
        ].sort((a, b) => a - b),
    [entries, effectiveYear],
  )
  // Drop a stale month when it isn't present in the newly selected year
  const effectiveMonth
    = selectedMonth !== null && availableMonths.includes(selectedMonth)
      ? selectedMonth
      : null

  const filtered = useMemo(
    () =>
      effectiveYear === null
        ? []
        : entries.filter(e => {
          const d = new Date(e.date)
          if (d.getFullYear() !== effectiveYear) return false
          return effectiveMonth === null || d.getMonth() === effectiveMonth
        }),
    [entries, effectiveYear, effectiveMonth],
  )

  return {
    availableYears,
    effectiveYear,
    setSelectedYear,
    availableMonths,
    effectiveMonth,
    setSelectedMonth,
    filtered,
  }
}

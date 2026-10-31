import { useMemo, useState } from 'react'

export function usePeriodFilter(entries: { date: string | Date }[]) {
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

  const matches = (entry: { date: string | Date }) => {
    const d = new Date(entry.date)
    if (d.getFullYear() !== effectiveYear) return false
    return effectiveMonth === null || d.getMonth() === effectiveMonth
  }

  return {
    availableYears,
    effectiveYear,
    setSelectedYear,
    availableMonths,
    effectiveMonth,
    setSelectedMonth,
    matches,
  }
}

export type PeriodFilter = ReturnType<typeof usePeriodFilter>

import { Group } from '@mantine/core'

import type { PeriodFilter } from '@/hooks/usePeriodFilter'
import type { ReactNode } from 'react'

import MonthSelect from '@/components/MonthSelect'
import YearSelect from '@/components/YearSelect'

export default function PeriodFilters({ period, children }: { period: PeriodFilter, children?: ReactNode }) {
  const { availableYears, effectiveYear, setSelectedYear, availableMonths, effectiveMonth, setSelectedMonth } = period
  const hasYears = availableYears.length > 0 && effectiveYear !== null
  if (!hasYears && availableMonths.length === 0 && !children) return null

  return (
    <Group gap="sm">
      {hasYears && <YearSelect value={effectiveYear} onChange={setSelectedYear} years={availableYears} />}
      {availableMonths.length > 0 && (
        <MonthSelect value={effectiveMonth} onChange={setSelectedMonth} months={availableMonths} />
      )}
      {children}
    </Group>
  )
}

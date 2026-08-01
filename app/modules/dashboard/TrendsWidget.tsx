import { Group, Stack, Text } from '@mantine/core'
import Card from '@ui/Card'
import { useState } from 'react'

import TargetBar from './TargetBar'
import ValueModeToggle, { type ValueMode } from './ValueModeToggle'

import type { TrendsDto } from '@/lib/types'

import { formatNumberDelta, formatRubDelta, formatYoyDelta } from '@/lib/utils'

interface Row {
  label: string
  current: number
  previous: number
  invert?: boolean
  // Signed per-month year-over-year difference of two totals, suffixed «/мес».
  monthlyDelta: (current: number, previous: number) => string
}

export default function TrendsWidget({ trends, elapsedMonths }: { trends: TrendsDto, elapsedMonths: number }) {
  const [mode, setMode] = useState<ValueMode>('pct')

  const months = elapsedMonths || 1
  const rubDelta = (current: number, previous: number) => `${formatRubDelta(current / months, previous / months)}/мес`
  const countDelta = (current: number, previous: number) => `${formatNumberDelta(current / months, previous / months)}/мес`

  const rows: Row[] = [
    { label: 'Звонки', ...trends.calls, monthlyDelta: countDelta },
    { label: 'Доходы', ...trends.revenue, monthlyDelta: rubDelta },
    { label: 'Расходы', ...trends.expenses, invert: true, monthlyDelta: rubDelta },
  ]

  return (
    <Card>
      <Group justify="space-between" mb="lg">
        <Text fz="xl" fw={700}>Тренды</Text>
        <ValueModeToggle value={mode} onChange={setMode} />
      </Group>

      <Stack gap="lg">
        {rows.map(row => (
          <Group key={row.label} wrap="nowrap" gap="md">
            <Text w={72} size="sm">{row.label}</Text>
            <TargetBar
              current={row.current}
              previous={row.previous}
              invert={row.invert}
              showYearLabel
              tooltip={
                mode === 'pct'
                  ? formatYoyDelta(row.current, row.previous)
                  : row.monthlyDelta(row.current, row.previous)
              }
            />
          </Group>
        ))}
      </Stack>
    </Card>
  )
}

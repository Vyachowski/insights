import { Group, Stack, Text } from '@mantine/core'
import Card from '@ui/Card'
import { useState } from 'react'

import TargetBar from './TargetBar'
import ValueModeToggle, { type ValueMode } from './ValueModeToggle'

import type { DashboardSummary } from '@/server/core/dashboard'

import { formatNumberDelta, formatRubDelta, formatYoyDelta } from '@/lib/utils'

export default function TrendsWidget({ trends }: { trends: DashboardSummary['trends'] }) {
  const [mode, setMode] = useState<ValueMode>('pct')

  const rows = [
    { label: 'Звонки', ...trends.calls, invert: false, formatDelta: formatNumberDelta },
    { label: 'Доходы', ...trends.revenue, invert: false, formatDelta: formatRubDelta },
    { label: 'Расходы', ...trends.expenses, invert: true, formatDelta: formatRubDelta },
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
                  : `${row.formatDelta(row.monthlyCurrent, row.monthlyPrevious)}/мес`
              }
            />
          </Group>
        ))}
      </Stack>
    </Card>
  )
}

import { Group, Stack, Text } from '@mantine/core'
import Card from '@ui/Card'
import { useState } from 'react'

import TargetBar from './TargetBar'
import ValueModeToggle, { type ValueMode } from './ValueModeToggle'

import type { DashboardSummary } from '@/server/core/dashboard'

import { formatDayMonth, formatNumberDelta, formatRubDelta, formatYoyDelta } from '@/lib/format'

export default function TrendsWidget({ trends }: { trends: DashboardSummary['trends'] }) {
  const [mode, setMode] = useState<ValueMode>('pct')

  const { reconciledUntil } = trends
  const rows = [
    { label: 'Звонки', ...trends.calls, invert: false, formatDelta: formatNumberDelta, note: null },
    { label: 'Доходы', ...trends.revenue, invert: false, formatDelta: formatRubDelta, note: null },
    {
      label: 'Расходы',
      ...trends.expenses,
      invert: true,
      formatDelta: formatRubDelta,
      note: reconciledUntil && `Сверено с Гудком до ${formatDayMonth(reconciledUntil)}`,
    },
  ]

  return (
    <Card>
      <Group justify="space-between" mb="lg">
        <Text fz="xl" fw={700}>Тренды</Text>
        <ValueModeToggle value={mode} onChange={setMode} />
      </Group>

      <Stack gap="lg">
        {rows.map(row => (
          <Stack key={row.label} gap={4}>
            <Group wrap="nowrap" gap="md">
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
            {row.note && <Text size="xs" c="dimmed">{row.note}</Text>}
          </Stack>
        ))}
      </Stack>
    </Card>
  )
}

import { Group, Stack, Text } from '@mantine/core'
import Card from '@ui/Card'
import { useState } from 'react'

import TargetBar from './TargetBar'
import ValueModeToggle, { type ValueMode } from './ValueModeToggle'

import type { TrendsDto } from '@/lib/types'

import { formatDeltaPercent, formatNumber, formatRub } from '@/lib/utils'

interface Row {
  label: string
  current: number
  previous: number
  invert?: boolean
  format: (value: number) => string
}

export default function TrendsWidget({ trends }: { trends: TrendsDto }) {
  const [mode, setMode] = useState<ValueMode>('pct')

  const rows: Row[] = [
    { label: 'Звонки', ...trends.calls, format: formatNumber },
    { label: 'Доходы', ...trends.revenue, format: formatRub },
    { label: 'Расходы', ...trends.expenses, invert: true, format: formatRub },
  ]

  return (
    <Card>
      <Group justify="space-between" mb="lg">
        <Text tt="uppercase" size="xs" c="dimmed" fw={600}>Тренды</Text>
        <ValueModeToggle value={mode} onChange={setMode} />
      </Group>

      <Stack gap="lg">
        {rows.map(row => (
          <Group key={row.label} wrap="nowrap" gap="md">
            <Text w={72} size="sm" c="dimmed">{row.label}</Text>
            <TargetBar
              current={row.current}
              previous={row.previous}
              invert={row.invert}
              showYearLabel
              tooltip={
                mode === 'pct'
                  ? `${formatDeltaPercent(row.current, row.previous)} к 2025`
                  : row.format(row.current)
              }
            />
          </Group>
        ))}
      </Stack>
    </Card>
  )
}

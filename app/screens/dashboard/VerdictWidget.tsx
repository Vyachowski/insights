import { Group, Paper, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'

import ValueModeToggle, { type ValueMode } from './ValueModeToggle'

import type { DashboardSummary } from '@/server/core/dashboard'

import Card from '@/components/Card'
import { formatRub, formatRubDelta, formatYoyDelta } from '@/lib/format'

export default function VerdictWidget({ verdict }: { verdict: DashboardSummary['verdict'] }) {
  const [mode, setMode] = useState<ValueMode>('pct')
  const { isGrowing, isStrong, current, previous, monthlyCurrent, monthlyPrevious } = verdict
  const color = isGrowing ? 'teal' : 'red'
  const currentYear = new Date().getFullYear()

  const monthlyDelta = `${formatRubDelta(monthlyCurrent, monthlyPrevious)}/мес`

  return (
    <Card>
      <Group justify="space-between" mb="md">
        <Text fz="xl" fw={700}>Итог</Text>
        <ValueModeToggle value={mode} onChange={setMode} />
      </Group>

      <Group justify="space-between" align="center" wrap="wrap" gap="xl">
        <Group gap="lg" wrap="nowrap">
          <ThemeIcon size={96} radius="md" variant="light" color={color}>
            {isGrowing ? <TrendingUp size={46} /> : <TrendingDown size={46} />}
          </ThemeIcon>
          <Text fz={32} fw={700}>
            Бизнес {isStrong && 'сильно '}{isGrowing ? 'растёт' : 'падает'}
          </Text>
        </Group>

        <Paper withBorder radius="md" p="md" w={260} ta="center">
          <Stack gap={2} align="center">
            <Text
              fz={26}
              fw={700}
              c={color}
              h={48}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', lineHeight: 1 }}
            >
              {mode === 'pct' ? formatYoyDelta(current, previous) : monthlyDelta}
            </Text>
            <Tooltip
              withArrow
              label={(
                <Stack gap={2} miw={140}>
                  <Group justify="space-between" gap="lg" wrap="nowrap">
                    <Text size="xs">{currentYear}</Text>
                    <Text size="xs" fw={600}>{formatRub(current)}</Text>
                  </Group>
                  <Group justify="space-between" gap="lg" wrap="nowrap">
                    <Text size="xs">{currentYear - 1}</Text>
                    <Text size="xs">{formatRub(previous)}</Text>
                  </Group>
                  <Group justify="space-between" gap="lg" wrap="nowrap">
                    <Text size="xs" c="dimmed">в среднем</Text>
                    <Text size="xs" fw={600} c={color}>{monthlyDelta}</Text>
                  </Group>
                </Stack>
              )}
            >
              <Text size="sm" c="dimmed" style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                в среднем за год
              </Text>
            </Tooltip>
          </Stack>
        </Paper>
      </Group>
    </Card>
  )
}

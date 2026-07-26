import { Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core'
import Card from '@ui/Card'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'

import ValueModeToggle, { type ValueMode } from './ValueModeToggle'

import type { VerdictDto } from '@/lib/types'

import { formatRub } from '@/lib/utils'

const CURRENT_YEAR = new Date().getFullYear()
const PREVIOUS_YEAR = CURRENT_YEAR - 1

export default function VerdictWidget({ verdict }: { verdict: VerdictDto }) {
  const [mode, setMode] = useState<ValueMode>('pct')
  const { isGrowing, isStrong, growthPercent, current, previous } = verdict
  const color = isGrowing ? 'teal' : 'red'

  const sign = growthPercent > 0 ? '+' : growthPercent < 0 ? '−' : ''
  const percentText = `${sign}${Math.abs(growthPercent)}%`

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

        <Paper withBorder radius="md" p="md" miw={200} ta="center">
          {mode === 'pct'
            ? (
              <Stack gap={2} align="center">
                <Text fz={40} fw={700} c={color}>{percentText}</Text>
                <Tooltip
                  withArrow
                  label={`${CURRENT_YEAR}: ${formatRub(current)} · ${PREVIOUS_YEAR}: ${formatRub(previous)}`}
                >
                  <Text size="sm" c="dimmed" style={{ textDecoration: 'underline dotted', cursor: 'help' }}>
                    в этом году
                  </Text>
                </Tooltip>
              </Stack>
            )
            : (
              <SimpleGrid cols={2} spacing={4} verticalSpacing={2}>
                <Text c="dimmed" ta="left">{CURRENT_YEAR}</Text>
                <Text ff="monospace" fw={700} ta="right">{formatRub(current)}</Text>
                <Text c="dimmed" ta="left">{PREVIOUS_YEAR}</Text>
                <Text ff="monospace" fw={600} c="dimmed" ta="right">{formatRub(previous)}</Text>
              </SimpleGrid>
            )}
        </Paper>
      </Group>
    </Card>
  )
}

import { Box, Group, Paper, Stack, Text, Tooltip } from '@mantine/core'
import Card from '@ui/Card'

import type { MonthlyProfitDto } from '@/lib/types'

import { formatDeltaPercent, formatRub } from '@/lib/utils'

const CURRENT_YEAR = new Date().getFullYear()
const PREVIOUS_YEAR = CURRENT_YEAR - 1

const MONTH_LABELS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
const CHART_HALF = 60 // px above / below the zero line

// Profit is teal, loss is red; the current year is solid, the previous muted.
function barColor(value: number, isCurrent: boolean) {
  if (value >= 0) return isCurrent ? 'var(--mantine-color-teal-6)' : 'var(--mantine-color-teal-2)'
  return isCurrent ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-red-2)'
}

export default function MonthlyProfitWidget({ monthly }: { monthly: MonthlyProfitDto }) {
  const { months, averageCurrent, averagePrevious, elapsedMonths } = monthly
  const maxAbs = Math.max(1, ...months.flatMap(m => [Math.abs(m.current), Math.abs(m.previous)]))
  const barLen = (value: number) => (value === 0 ? 0 : Math.max(2, Math.round((Math.abs(value) / maxAbs) * CHART_HALF)))
  const hasPrevious = averagePrevious !== 0
  const deltaColor = averageCurrent >= averagePrevious ? 'teal' : 'red'

  const bar = (value: number, isCurrent: boolean) => {
    const len = barLen(value)
    const positive = value >= 0
    return (
      <Box style={{ width: 9, height: CHART_HALF * 2, display: 'flex', flexDirection: 'column' }}>
        <Box style={{ height: CHART_HALF, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {positive && <Box style={{ height: len, background: barColor(value, isCurrent), borderRadius: '2px 2px 0 0' }} />}
        </Box>
        <Box style={{ height: CHART_HALF, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {!positive && <Box style={{ height: len, background: barColor(value, isCurrent), borderRadius: '0 0 2px 2px' }} />}
        </Box>
      </Box>
    )
  }

  return (
    <Card>
      <Group justify="space-between" align="flex-start" mb="lg" wrap="wrap" gap="md">
        <Text fz="xl" fw={700}>Прибыль по месяцам</Text>

        <Paper withBorder radius="md" p="sm" ta="right" miw={200}>
          <Text size="xs" c="dimmed">В среднем прибыль в месяц</Text>
          <Text fz={26} fw={700} c={averageCurrent < 0 ? 'red' : undefined}>{formatRub(averageCurrent)}</Text>
          <Text size="xs" c="dimmed">
            за {elapsedMonths} мес ·{' '}
            {hasPrevious
              ? <Text span c={deltaColor} fw={600}>{formatDeltaPercent(averageCurrent, averagePrevious)} к {PREVIOUS_YEAR}</Text>
              : '—'}
          </Text>
        </Paper>
      </Group>

      <Group align="stretch" gap="xs" wrap="nowrap">
        {months.map(m => {
          const future = m.month > elapsedMonths && m.current === 0 && m.previous === 0
          return (
            <Tooltip
              key={m.month}
              withArrow
              position="top"
              events={{ hover: true, focus: true, touch: true }}
              label={
                <Stack gap={2}>
                  <Text size="xs" fw={600}>{MONTH_LABELS[m.month - 1]}</Text>
                  <Text size="xs">{CURRENT_YEAR}: {formatRub(m.current)}</Text>
                  <Text size="xs">{PREVIOUS_YEAR}: {formatRub(m.previous)}</Text>
                  {m.previous !== 0 && (
                    <Text size="xs" c="dimmed">{formatDeltaPercent(m.current, m.previous)} к {PREVIOUS_YEAR}</Text>
                  )}
                </Stack>
              }
            >
              <Stack gap={6} align="center" style={{ flex: 1, minWidth: 0 }}>
                <Box pos="relative" style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                  {bar(m.current, true)}
                  {bar(m.previous, false)}
                  <Box
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: CHART_HALF,
                      borderTop: '1px dashed var(--mantine-color-default-border)',
                      pointerEvents: 'none',
                    }}
                  />
                </Box>
                <Text size="9px" c={future ? 'dimmed' : undefined} style={{ opacity: future ? 0.5 : 1 }}>
                  {MONTH_LABELS[m.month - 1]}
                </Text>
              </Stack>
            </Tooltip>
          )
        })}
      </Group>

      <Group gap="lg" mt="md" justify="center">
        <Group gap={6}>
          <Box w={10} h={10} style={{ background: 'var(--mantine-color-teal-6)', borderRadius: 2 }} />
          <Text size="xs" c="dimmed">{CURRENT_YEAR} (текущий)</Text>
        </Group>
        <Group gap={6}>
          <Box w={10} h={10} style={{ background: 'var(--mantine-color-teal-2)', borderRadius: 2 }} />
          <Text size="xs" c="dimmed">{PREVIOUS_YEAR} (прошлый)</Text>
        </Group>
        <Text size="xs" c="dimmed">· красный — убыток</Text>
      </Group>
    </Card>
  )
}

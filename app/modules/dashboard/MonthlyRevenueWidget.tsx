import { Box, Group, Paper, Stack, Text, Tooltip } from '@mantine/core'
import Card from '@ui/Card'

import type { MonthlyRevenueDto } from '@/lib/types'

import { formatDeltaPercent, formatRub } from '@/lib/utils'

const CURRENT_YEAR = new Date().getFullYear()
const PREVIOUS_YEAR = CURRENT_YEAR - 1

const MONTH_LABELS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
const CHART_HEIGHT = 120

const CURRENT_COLOR = 'var(--mantine-color-teal-6)'
const PREVIOUS_COLOR = 'var(--mantine-color-gray-5)'

export default function MonthlyRevenueWidget({ monthly }: { monthly: MonthlyRevenueDto }) {
  const { months, averageCurrent, averagePrevious, elapsedMonths } = monthly
  const max = Math.max(1, ...months.flatMap(m => [m.current, m.previous]))
  const barHeight = (value: number) => (value > 0 ? Math.max(2, Math.round((value / max) * CHART_HEIGHT)) : 0)
  const hasPrevious = averagePrevious > 0
  const deltaColor = averageCurrent >= averagePrevious ? 'teal' : 'red'

  return (
    <Card>
      <Group justify="space-between" align="flex-start" mb="lg" wrap="wrap" gap="md">
        <Text fz="xl" fw={700}>Доход по месяцам</Text>

        <Paper withBorder radius="md" p="sm" ta="right" miw={200}>
          <Text size="xs" c="dimmed">В среднем в месяц</Text>
          <Text fz={26} fw={700}>{formatRub(averageCurrent)}</Text>
          <Text size="xs" c="dimmed">
            за {elapsedMonths} мес ·{' '}
            {hasPrevious
              ? <Text span c={deltaColor} fw={600}>{formatDeltaPercent(averageCurrent, averagePrevious)} к {PREVIOUS_YEAR}</Text>
              : '—'}
          </Text>
        </Paper>
      </Group>

      <Group align="flex-end" gap="xs" wrap="nowrap">
        {months.map(m => {
          const future = m.month > elapsedMonths && m.current === 0
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
                  {m.previous > 0 && (
                    <Text size="xs" c="dimmed">{formatDeltaPercent(m.current, m.previous)} к {PREVIOUS_YEAR}</Text>
                  )}
                </Stack>
              }
            >
              <Stack gap={6} align="center" style={{ flex: 1, minWidth: 0 }}>
                <Box
                  style={{
                    height: CHART_HEIGHT,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 3,
                  }}
                >
                  <Box style={{ width: 9, height: barHeight(m.current), background: CURRENT_COLOR, borderRadius: 2 }} />
                  <Box style={{ width: 9, height: barHeight(m.previous), background: PREVIOUS_COLOR, borderRadius: 2 }} />
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
          <Box w={10} h={10} style={{ background: CURRENT_COLOR, borderRadius: 2 }} />
          <Text size="xs" c="dimmed">{CURRENT_YEAR} (текущий)</Text>
        </Group>
        <Group gap={6}>
          <Box w={10} h={10} style={{ background: PREVIOUS_COLOR, borderRadius: 2 }} />
          <Text size="xs" c="dimmed">{PREVIOUS_YEAR} (прошлый)</Text>
        </Group>
      </Group>
    </Card>
  )
}

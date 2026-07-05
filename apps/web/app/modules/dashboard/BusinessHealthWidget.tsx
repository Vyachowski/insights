import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { formatNumber } from '@/lib/utils'

export default function BusinessHealthWidget({ summary }: {
  summary: {
    isGrowing: boolean;
    growthPercent: number;
    avgCurrent: number;
    avgPrevious: number;
  }
}) {
  const { isGrowing, growthPercent, avgCurrent, avgPrevious } = summary
  const color = isGrowing ? 'teal' : 'red'

  return (
    <Paper withBorder radius="lg" p="xl" style={{ borderColor: `var(--mantine-color-${color}-5)` }}>
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="lg">
        <Group gap="lg" wrap="nowrap">
          <ThemeIcon size={72} radius="lg" variant="light" color={color}>
            {isGrowing ? <TrendingUp size={40} /> : <TrendingDown size={40} />}
          </ThemeIcon>

          <Stack gap={4}>
            <Text size="sm" c="dimmed" tt="uppercase" fw={500}>
              Итоговый статус • Годовой тренд
            </Text>
            <Text fz={32} fw={700} c={color}>
              {isGrowing ? '📈 Бизнес растет' : '📉 Бизнес падает'}
            </Text>
            <Text c="dimmed">
              Средняя недельная прибыль{' '}
              <Text span fw={700} c={color}>
                {isGrowing ? '+' : '−'}{Math.abs(growthPercent)}%
              </Text>{' '}
              по сравнению с прошлым годом
            </Text>
          </Stack>
        </Group>

        <Stack gap="xs" align="flex-end">
          <Text size="sm" c="dimmed" tt="uppercase" fw={500}>
            Средние недельные показатели
          </Text>
          <Group gap="sm">
            <Text size="sm" c="dimmed">2026:</Text>
            <Text fw={700} fz={24} ff="monospace">{formatNumber(avgCurrent)} ₽</Text>
          </Group>
          <Group gap="sm">
            <Text size="sm" c="dimmed">2025:</Text>
            <Text fw={600} fz={20} c="dimmed" ff="monospace">{formatNumber(avgPrevious)} ₽</Text>
          </Group>
        </Stack>
      </Group>
    </Paper>
  )
}

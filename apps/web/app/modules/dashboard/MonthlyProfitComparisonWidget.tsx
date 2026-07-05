import { Badge, Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import Card from '@ui/Card'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { formatNumber } from '@/lib/utils'

export default function MonthlyProfitComparisonWidget({ comparison }: {
  comparison: {
    currentMonth: {
      month: string;
      profit: number;
    };
    lastYearSameMonth: {
      month: string;
      profit: number;
    };
    difference: number;
    percentage: number;
  }
}) {
  const { currentMonth, lastYearSameMonth, percentage } = comparison
  const isPositive = percentage >= 0

  return (
    <Card>
      <Title order={3} mb="lg">Месячное сравнение прибыли</Title>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <Stack gap="xs">
          <Text size="sm" c="dimmed" tt="uppercase" fw={500}>Текущий месяц</Text>
          <Text fz={40} fw={700} c="dimmed">
            {formatNumber(currentMonth.profit)}
            <Text span fz={24} c="dimmed" ml={6}>₽</Text>
          </Text>
        </Stack>
        <Stack gap="xs">
          <Text size="sm" c="dimmed" tt="uppercase" fw={500}>Прошлый год</Text>
          <Text fz={40} fw={700} c="dimmed">
            {formatNumber(lastYearSameMonth.profit)}
            <Text span fz={24} c="dimmed" ml={6}>₽</Text>
          </Text>
        </Stack>
      </SimpleGrid>

      <Divider my="lg" />

      <Group gap="md">
        <Text c="dimmed" fw={500}>Изменение:</Text>
        <Badge
          size="lg"
          variant="light"
          color={isPositive ? 'teal' : 'red'}
          leftSection={isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        >
          {Math.abs(percentage)}%
        </Badge>
      </Group>
    </Card>
  )
}

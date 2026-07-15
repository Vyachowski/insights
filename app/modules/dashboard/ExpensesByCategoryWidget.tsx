import { Group, Stack, Text, Title } from '@mantine/core'
import Card from '@ui/Card'

import { formatNumber } from '@/lib/utils'

interface CategoryExpense {
  category: string
  amount: number
}

export default function ExpensesByCategoryWidget({ data }: { data: CategoryExpense[] }) {
  return (
    <Card>
      <Title order={3} mb="lg">Расходы по категориям</Title>

      {data.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="xl">
          Нет расходов за текущий месяц
        </Text>
      ) : (
        <Stack gap="sm">
          {data.map(item => (
            <Group key={item.category} justify="space-between" wrap="nowrap">
              <Text size="sm">{item.category}</Text>
              <Text size="sm" fw={600} c="red" style={{ whiteSpace: 'nowrap' }}>
                {formatNumber(item.amount)} ₽
              </Text>
            </Group>
          ))}
        </Stack>
      )}
    </Card>
  )
}

import { SimpleGrid } from '@mantine/core'
import MetricCard from '@ui/MetricCard'

export default function WeeklyFinancialMetricsWidget({ metrics }: {
  metrics: {
    profit: number | null;
    revenue: number | null;
    expenses: number | null;
  }
}) {
  const { profit, revenue, expenses } = metrics

  return (
    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
      <MetricCard title="Прибыль недели" value={profit} />
      <MetricCard title="Выручка недели" value={revenue} />
      <MetricCard title="Расходы недели" value={expenses} />
    </SimpleGrid>
  )
}

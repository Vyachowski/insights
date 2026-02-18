import MetricCard from '../../../components/MetricCard'

export default function KeyFinancialMetricsCardGroup({ metrics }: {
  metrics: {
    profit: number | null;
    revenue: number | null;
    expenses: number | null;
  }
}) {
  const { profit, revenue, expenses } = metrics

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up opacity-0 stagger-2">
      <MetricCard
        title="Прибыль недели"
        value={profit}
      />
      <MetricCard title="Выручка недели" value={revenue} />
      <MetricCard title="Расходы недели" value={expenses} />
    </div>
  )
}

import MetricCard from '../../../components/MetricCard'
import { weeklyData } from '../../../mock'

export default function KeyFinancialMetricsCardGroup({ profit, revenue, expenses }: {
  profit: number;
  revenue: number;
  expenses: number
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up opacity-0 stagger-2">
      <MetricCard
        title="Прибыль недели"
        value={profit}
        trend={weeklyData.profitChange}
        isProfit={true}
      />
      <MetricCard title="Выручка недели" value={revenue} />
      <MetricCard title="Расходы недели" value={expenses} />
    </div>
  )
}

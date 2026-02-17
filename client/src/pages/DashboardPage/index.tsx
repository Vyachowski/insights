
import BusinessHealthCard from './_components/BusinessHealthCard'
import KeyFinancialMetrics from './_components/KeyFinancialMetricsCardGroup'
import MonthComparisonCard from './_components/MonthComparisonCard'
import useProgressiveMetrics from '../../hooks/useProgressiveMetrics'

import { useAppSelector } from '@/store/hooks'
import { selectDashboardData } from '@/store/selectors/dashboardSelectors'

export default function DashboardPage() {
  const { businessHealth, lastWeekSummary, monthlyComparison, yearlyTrend, citiesProfit } = useAppSelector(selectDashboardData)
  const { currentProfit, currentRevenue, currentExpenses } = useProgressiveMetrics(lastWeekSummary && lastWeekSummary.profit || 0, lastWeekSummary && lastWeekSummary.revenue || 0, lastWeekSummary && lastWeekSummary.expenses || 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {businessHealth && <BusinessHealthCard metrics={businessHealth} />}
      <KeyFinancialMetrics profit={currentProfit} revenue={currentRevenue} expenses={currentExpenses}/>
      {monthlyComparison && <MonthComparisonCard currentMonth={monthlyComparison.currentMonth.profit} lastYear={monthlyComparison.lastYearSameMonth.profit} change={monthlyComparison.difference}/>}
      {/* FIXME: Data is not matching */}
      {/* {yearlyTrend && <YearlyTrendData data={yearlyTrend} />}
      <CityProfitShareCard data={citiesProfit}/> */}
    </div>
  )
}

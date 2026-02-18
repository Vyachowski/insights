
import BusinessHealthCard from './_components/BusinessHealthCard'
import KeyFinancialMetricsCardGroup from './_components/KeyFinancialMetricsCardGroup'
import MonthComparisonCard from './_components/MonthComparisonCard'
import useProgressiveMetrics from '../../hooks/useProgressiveMetrics'

import { useAppSelector } from '@/store/hooks'
import { selectDashboardData } from '@/store/selectors/dashboardSelectors'

export default function DashboardPage() {
  const { businessHealth, lastWeekSummary, monthlyComparison, yearlyTrend, citiesProfit } = useAppSelector(selectDashboardData)
  const currentFinances = useProgressiveMetrics(lastWeekSummary)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {businessHealth && <BusinessHealthCard metrics={businessHealth} />}
      {currentFinances && <KeyFinancialMetricsCardGroup metrics={currentFinances}/>}
      {monthlyComparison && <MonthComparisonCard metrics={monthlyComparison} />}
      {/* FIXME: Data is not matching */}
      {/* {yearlyTrend && <YearlyTrendData data={yearlyTrend} />}
      <CityProfitShareCard data={citiesProfit}/> */}
    </div>
  )
}

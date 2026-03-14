import { useEffect } from 'react'

import BusinessHealthWidget from '../components/BusinessHealthWidget'
import CityProfitShareWidget from '../components/CityProfitShareWidget'
import MonthlyProfitComparisonWidget from '../components/MonthlyProfitComparisonWidget'
import WeeklyFinancialMetricsWidget from '../components/WeeklyFinancialMetricsWidget'
import YearlyProfitTrendChart from '../components/YearlyProfitTrendChart'

import useProgressiveMetrics from '@/hooks/useProgressiveMetrics'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectDashboardData } from '@/store/selectors/dashboardSelectors'
import { fetchDashboardSummary } from '@/store/thunks/dashboardThunks'

const DashboardPage = () => {
  const dispatch = useAppDispatch()

  const { businessHealth, lastWeekSummary, monthlyComparison, yearlyProfitTrend, citiesProfit } = useAppSelector(selectDashboardData)
  const currentFinances = useProgressiveMetrics(lastWeekSummary)

  useEffect(() => {
    async function initDashboard() {
      await dispatch(fetchDashboardSummary())
    }

    initDashboard()
  }, [dispatch])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {businessHealth && <BusinessHealthWidget summary={businessHealth} />}
      {currentFinances && <WeeklyFinancialMetricsWidget metrics={currentFinances}/>}
      {monthlyComparison && <MonthlyProfitComparisonWidget comparison={monthlyComparison} />}
      {yearlyProfitTrend && <YearlyProfitTrendChart data={yearlyProfitTrend} />}
      {citiesProfit && <CityProfitShareWidget metrics={citiesProfit} />}
    </div>
  )
}

export default DashboardPage

import { Container, Stack } from '@mantine/core'
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
    <Container size="xl" px={0}>
      <Stack gap="xl">
        {businessHealth && <BusinessHealthWidget summary={businessHealth} />}
        {currentFinances && <WeeklyFinancialMetricsWidget metrics={currentFinances} />}
        {monthlyComparison && <MonthlyProfitComparisonWidget comparison={monthlyComparison} />}
        {yearlyProfitTrend && <YearlyProfitTrendChart data={yearlyProfitTrend} />}
        {citiesProfit && <CityProfitShareWidget metrics={citiesProfit} />}
      </Stack>
    </Container>
  )
}

export default DashboardPage

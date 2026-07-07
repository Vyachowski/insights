import { Container, Stack } from '@mantine/core'

import type { Route } from './+types/dashboard'

import useProgressiveMetrics from '@/hooks/useProgressiveMetrics'
import BusinessHealthWidget from '@/modules/dashboard/BusinessHealthWidget'
import CityProfitShareWidget from '@/modules/dashboard/CityProfitShareWidget'
import MonthlyProfitComparisonWidget from '@/modules/dashboard/MonthlyProfitComparisonWidget'
import WeeklyFinancialMetricsWidget from '@/modules/dashboard/WeeklyFinancialMetricsWidget'
import YearlyProfitTrendChart from '@/modules/dashboard/YearlyProfitTrendChart'
import { requireUser } from '@/server/auth'
import { getDashboardSummary } from '@/server/queries/dashboard'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)
  return getDashboardSummary()
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { businessHealth, lastWeekSummary, monthlyComparison, yearlyProfitTrend, citiesProfit }
    = loaderData
  const currentFinances = useProgressiveMetrics(lastWeekSummary)

  return (
    <Container size="xl" px={0}>
      <Stack gap="xl">
        <BusinessHealthWidget summary={businessHealth} />
        {currentFinances && <WeeklyFinancialMetricsWidget metrics={currentFinances} />}
        <MonthlyProfitComparisonWidget comparison={monthlyComparison} />
        <YearlyProfitTrendChart data={yearlyProfitTrend} />
        <CityProfitShareWidget metrics={citiesProfit} />
      </Stack>
    </Container>
  )
}

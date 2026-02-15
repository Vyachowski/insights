
import BusinessHealthCard from './_components/BusinessHealthCard'
import CityProfitShareCard from './_components/CityProfitShareCard'
import KeyFinancialMetrics from './_components/KeyFinancialMetricsCardGroup'
import MonthComparisonCard from './_components/MonthComparisonCard'
import YearlyTrendData from './_components/YearlyTrendCard'
import useProgressiveMetrics from '../../hooks/useProgressiveMetrics'
import {
  citiesData,
  monthlyComparison,
  weeklyData,
  yearlyTrendData,
} from '../../mock/index'

const { profit, revenue, expenses } = weeklyData

const calculateBusinessHealth = () => {
  const avgCurrent =
    yearlyTrendData.reduce((sum, item) => sum + item.current, 0) /
      yearlyTrendData.length
  const avgPrevious =
    yearlyTrendData.reduce((sum, item) => sum + item.previous, 0) /
      yearlyTrendData.length
  const growthPercent = Number(
    (((avgCurrent - avgPrevious) / avgPrevious) * 100).toFixed(1),
  )
  const isGrowing = growthPercent > 0

  return {
    isGrowing,
    growthPercent: Math.abs(growthPercent),
    avgCurrent: Math.round(avgCurrent),
    avgPrevious: Math.round(avgPrevious),
  }
}

export default function FinancialPage() {
  const { currentProfit, currentRevenue, currentExpenses } = useProgressiveMetrics(profit, revenue, expenses)
  const businessHealth = calculateBusinessHealth()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <BusinessHealthCard metrics={businessHealth} />
      <KeyFinancialMetrics profit={currentProfit} revenue={currentRevenue} expenses={currentExpenses}/>
      <MonthComparisonCard currentMonth={monthlyComparison.currentMonth} lastYear={monthlyComparison.lastYear} change={monthlyComparison.change}/>
      <YearlyTrendData data={yearlyTrendData} />
      <CityProfitShareCard data={citiesData}/>
    </div>
  )
}

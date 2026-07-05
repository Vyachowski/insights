import { useEffect, useState } from 'react'

type Metrics = {
  profit: number
  revenue: number
  expenses: number
} | undefined | null

export default function useProgressiveMetrics(metrics: Metrics) {
  const [currentProfit, setCurrentProfit] = useState<number | null>(metrics?.profit ?? null)
  const [currentRevenue, setCurrentRevenue] = useState<number | null>(metrics?.revenue ?? null)
  const [currentExpenses, setCurrentExpenses] = useState<number | null>(metrics?.expenses ?? null)

  useEffect(() => {
    function setProgressiveValues() {
      if (!metrics) {
        setCurrentProfit(null)
        setCurrentRevenue(null)
        setCurrentExpenses(null)

        return
      }

      const duration = 1500
      const steps = 60
      const stepDuration = duration / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)

        setCurrentProfit(Math.floor(metrics.profit * easeOutQuart))
        setCurrentRevenue(Math.floor(metrics.revenue * easeOutQuart))
        setCurrentExpenses(Math.floor(metrics.expenses * easeOutQuart))

        if (currentStep >= steps) clearInterval(interval)
      }, stepDuration)

      return interval
    }

    const interval = setProgressiveValues()
    return () => clearInterval(interval)
  }, [metrics])

  return { profit: currentProfit, revenue: currentRevenue, expenses: currentExpenses }
}

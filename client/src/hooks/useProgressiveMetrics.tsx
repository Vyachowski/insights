import { useEffect, useState } from 'react'

export default function useProgressiveMetrics(
  targetProfit: number,
  targetRevenue: number,
  targetExpenses: number,
) {
  const [currentProfit, setCurrentProfit] = useState(0)
  const [currentRevenue, setCurrentRevenue] = useState(0)
  const [currentExpenses, setCurrentExpenses] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setCurrentProfit(Math.floor(targetProfit * easeOutQuart))
      setCurrentRevenue(Math.floor(targetRevenue * easeOutQuart))
      setCurrentExpenses(Math.floor(targetExpenses * easeOutQuart))

      if (currentStep >= steps) clearInterval(interval)
    }, stepDuration)

    return () => clearInterval(interval)
  }, [targetProfit, targetRevenue, targetExpenses])

  return { currentProfit, currentRevenue, currentExpenses }
}

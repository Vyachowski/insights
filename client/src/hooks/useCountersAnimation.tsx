import { useEffect, useState } from 'react'

export default function useCountersAnimation(profit: number, revenue: number, expenses: number) {
  const [animatedProfit, setAnimatedProfit] = useState(0)
  const [animatedRevenue, setAnimatedRevenue] = useState(0)
  const [animatedExpenses, setAnimatedExpenses] = useState(0)

  useEffect(() => {
    function animateCounters() {
      const duration = 1500
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)

        setAnimatedProfit(Math.floor(profit * easeOutQuart))
        setAnimatedRevenue(Math.floor(revenue * easeOutQuart))
        setAnimatedExpenses(Math.floor(expenses * easeOutQuart))

        if (currentStep >= steps) clearInterval(interval)
      }, stepDuration)

      return interval
    }

    const interval = animateCounters()

    return () => clearInterval(interval)
  }, [profit, revenue, expenses])

  return { animatedProfit, animatedRevenue, animatedExpenses }
}

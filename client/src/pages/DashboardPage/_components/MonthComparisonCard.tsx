import { TrendingDown, TrendingUp } from 'lucide-react'

import { formatNumber } from '../../../lib/utils'

import Card from '@/components/Card'

export default function MonthComparisonCard({ metrics }: {
  metrics: {
    currentMonth: {
      month: string;
      profit: number;
    };
    lastYearSameMonth: {
      month: string;
      profit: number;
    };
    difference: number;
    percentage: number;
  }
}) {
  const { currentMonth, lastYearSameMonth, percentage } = metrics
  const isPositive = percentage >= 0

  return (
    <Card className='animate-slide-up opacity-0 stagger-3'>
      <h2 className="text-2xl font-bold text-white mb-6">
        Месячное сравнение прибыли
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="text-slate-400 text-sm font-medium tracking-wider uppercase">
            Текущий месяц
          </div>
          <div className="text-5xl font-bold text-slate-300">
            {formatNumber(currentMonth.profit)}
            <span className="text-2xl text-slate-500 ml-2">₽</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-slate-400 text-sm font-medium tracking-wider uppercase">
            Прошлый год
          </div>
          <div className="text-5xl font-bold text-slate-300">
            {formatNumber(lastYearSameMonth.profit)}
            <span className="text-2xl text-slate-500 ml-2">₽</span>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="text-slate-400 font-medium">Изменение:</div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${
            isPositive
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            {Math.abs(percentage)}%
          </div>
        </div>
      </div>
    </Card>
  )
}

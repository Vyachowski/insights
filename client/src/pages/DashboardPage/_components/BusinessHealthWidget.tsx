import { TrendingUp, TrendingDown } from 'lucide-react'

import { formatNumber } from '../../../lib/utils'

export default function BusinessHealthWidget({ summary }: {
  summary: {
    isGrowing: boolean;
    growthPercent: number;
    avgCurrent: number;
    avgPrevious: number;
  }
}) {
  const { isGrowing,
    growthPercent,
    avgCurrent,
    avgPrevious } = summary

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl border-2 shadow-2xl animate-slide-up opacity-0 stagger-1 ${
        isGrowing
          ? 'bg-linear-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/50'
          : 'bg-linear-to-br from-red-900/40 to-orange-900/40 border-red-500/50'
      }`}
    >
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -skew-x-12"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div
            className={`p-4 rounded-2xl ${
              isGrowing ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}
          >
            {summary.isGrowing ? (
              <TrendingUp
                size={48}
                className="text-emerald-400"
                strokeWidth={2.5}
              />
            ) : (
              <TrendingDown
                size={48}
                className="text-red-400"
                strokeWidth={2.5}
              />
            )}
          </div>

          <div>
            <div className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-2">
              Итоговый статус • Годовой тренд
            </div>
            <div
              className={`text-4xl font-bold mb-2 ${
                isGrowing ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isGrowing
                ? '📈 Бизнес растет'
                : '📉 Бизнес падает'}
            </div>
            <div className="text-slate-300 text-lg">
              Средняя недельная прибыль{' '}
              <span
                className={`font-bold ${
                  isGrowing
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }`}
              >
                {isGrowing ? '+' : '−'}
                {Math.abs(growthPercent)}%
              </span>{' '}
              по сравнению с прошлым годом
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-3">
            Средние недельные показатели
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4 justify-end">
              <span className="text-slate-400 text-sm">2026:</span>
              <span className="text-white font-bold text-2xl font-mono">
                {formatNumber(avgCurrent)} ₽
              </span>
            </div>
            <div className="flex items-center gap-4 justify-end">
              <span className="text-slate-500 text-sm">2025:</span>
              <span className="text-slate-400 font-semibold text-xl font-mono">
                {formatNumber(avgPrevious)} ₽
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute -bottom-10 -right-10 w-64 h-64 rounded-full blur-3xl opacity-20 ${
          isGrowing ? 'bg-emerald-500' : 'bg-red-500'
        }`}
      ></div>
    </div>
  )
}

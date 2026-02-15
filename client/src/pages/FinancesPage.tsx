
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import MetricCard from '../components/MetricCard'
import useCountersAnimation from '../hooks/useCountersAnimation'
import {
  citiesData,
  monthlyComparison,
  weeklyData,
  yearlyTrendData,
} from '../mock/index'
import { formatNumber } from '../lib/utils'

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
  const [selectedYear, setSelectedYear] = useState(2026)
  const { animatedProfit, animatedRevenue, animatedExpenses } = useCountersAnimation(profit, revenue, expenses)
  const barchartData = citiesData[selectedYear]

  const businessHealth = calculateBusinessHealth()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Итоговый вывод о состоянии бизнеса */}
      <div
        className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl border-2 shadow-2xl animate-slide-up opacity-0 stagger-1 ${
          businessHealth.isGrowing
            ? 'bg-linear-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/50'
            : 'bg-linear-to-br from-red-900/40 to-orange-900/40 border-red-500/50'
        }`}
      >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -skew-x-12"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className={`p-4 rounded-2xl ${
                businessHealth.isGrowing ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}
            >
              {businessHealth.isGrowing ? (
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
                  businessHealth.isGrowing ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {businessHealth.isGrowing
                  ? '📈 Бизнес растет'
                  : '📉 Бизнес падает'}
              </div>
              <div className="text-slate-300 text-lg">
                Средняя недельная прибыль{' '}
                <span
                  className={`font-bold ${
                    businessHealth.isGrowing
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {businessHealth.isGrowing ? '+' : '−'}
                  {businessHealth.growthPercent}%
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
                  {formatNumber(businessHealth.avgCurrent)} ₽
                </span>
              </div>
              <div className="flex items-center gap-4 justify-end">
                <span className="text-slate-500 text-sm">2025:</span>
                <span className="text-slate-400 font-semibold text-xl font-mono">
                  {formatNumber(businessHealth.avgPrevious)} ₽
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute -bottom-10 -right-10 w-64 h-64 rounded-full blur-3xl opacity-20 ${
            businessHealth.isGrowing ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        ></div>
      </div>

      {/* Карточки метрик */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up opacity-0 stagger-2">
        <MetricCard
          title="Прибыль неделя"
          value={animatedProfit}
          trend={weeklyData.profitChange}
          isProfit={true}
        />
        <MetricCard title="Выручка неделя" value={animatedRevenue} />
        <MetricCard title="Расходы неделя" value={animatedExpenses} />
      </div>

      {/* Месячное сравнение */}
      <div className="rounded-2xl p-8 backdrop-blur-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-2xl animate-slide-up opacity-0 stagger-3">
        <h2 className="text-2xl font-bold text-white mb-6">
          Месячное сравнение прибыли
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="text-slate-400 text-sm font-medium tracking-wider uppercase">
              Текущий месяц
            </div>
            <div className="text-5xl font-bold text-emerald-400">
              {formatNumber(monthlyComparison.currentMonth)}
              <span className="text-2xl text-slate-500 ml-2">₽</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-slate-400 text-sm font-medium tracking-wider uppercase">
              Прошлый год
            </div>
            <div className="text-5xl font-bold text-slate-300">
              {formatNumber(monthlyComparison.lastYear)}
              <span className="text-2xl text-slate-500 ml-2">₽</span>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="text-slate-400 font-medium">Изменение:</div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-lg">
              <TrendingUp size={20} />+{monthlyComparison.change}%
            </div>
          </div>
        </div>
      </div>

      {/* Годовой тренд */}
      <div className="rounded-2xl p-8 backdrop-blur-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-2xl animate-slide-up opacity-0 stagger-4">
        <h2 className="text-2xl font-bold text-white mb-6">
          Годовой тренд прибыли
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={yearlyTrendData}>
            <defs>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.2}
            />
            <XAxis
              dataKey="week"
              stroke="#64748b"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
              tickFormatter={value => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontFamily: 'Manrope',
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#475569"
              strokeWidth={3}
              dot={{ fill: '#475569', r: 4 }}
              name="Прошлый год"
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#10b981"
              strokeWidth={4}
              dot={{ fill: '#10b981', r: 5 }}
              fill="url(#currentGradient)"
              name="Текущий год"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="text-slate-400">Текущий год</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-500"></div>
            <span className="text-slate-400">Прошлый год</span>
          </div>
        </div>
      </div>

      {/* Прибыль по городам */}
      <div className="rounded-2xl p-8 backdrop-blur-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-2xl animate-slide-up opacity-0 stagger-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Прибыль по городам</h2>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white font-medium hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barchartData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.2}
            />
            <XAxis
              type="number"
              stroke="#64748b"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
              tickFormatter={value => `${value / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="city"
              stroke="#64748b"
              width={150}
              style={{ fontSize: '13px', fontFamily: 'Manrope' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontFamily: 'Manrope',
              }}
              formatter={value => [
                `${formatNumber(Number(value))} ₽`,
                'Прибыль',
              ]}
            />
            <Bar
              dataKey="profit"
              fill="url(#barGradient)"
              radius={[0, 8, 8, 0]}
              animationDuration={1000}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

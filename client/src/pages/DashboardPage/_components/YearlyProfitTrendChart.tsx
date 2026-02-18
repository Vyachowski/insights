import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts'

import type { YearlyProfitTrendPoint } from '@contracts/dashboard.contract'

import Card from '@/components/Card'

export default function YearlyProfitTrendChart({ data }: { data: YearlyProfitTrendPoint[] }) {

  return (
    <Card className='animate-slide-up opacity-0 stagger-4'>
      <h2 className="text-2xl font-bold text-white mb-6">
        Годовой тренд прибыли
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
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
            tickFormatter={value => `${value} нед.`}
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
    </Card>

  )
}

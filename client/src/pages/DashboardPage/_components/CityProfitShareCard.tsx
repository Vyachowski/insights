import { useState } from 'react'
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar, BarChart } from 'recharts'

import Card from '../../../components/Card'
import { formatNumber } from '../../../lib/utils'

interface CityProfitShareCardProps {
  data: Record<number, {
    city: string;
    profit: number;
  }[]> }

export default function CityProfitShareCard({ data }: CityProfitShareCardProps) {
  const [selectedYear, setSelectedYear] = useState(2026)
  const barchartData = data[selectedYear]

  return (
    <Card className='animate-slide-up opacity-0 stagger-5'>
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
    </Card>
  )
}

import { Group, Title } from '@mantine/core'
import Card from '@ui/Card'
import YearSelect from '@ui/YearSelect'
import { useMemo, useState } from 'react'
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar, BarChart } from 'recharts'

import type { YearlyCityProfitDto as YearlyCityProfit } from '@/lib/types'

import { formatNumber } from '@/lib/utils'

export default function CityProfitShareWidget({ metrics }: { metrics: YearlyCityProfit[] }) {
  const availableYears = useMemo(() => metrics.map(metric => metric.year), [metrics])

  const [selectedYear, setSelectedYear] = useState(availableYears.at(0))
  const barchartData = useMemo(() => metrics.find(metric => metric.year === selectedYear), [metrics, selectedYear])
  const sortedCitiesData = useMemo(() =>
    barchartData?.cities?.slice().sort((city1, city2) => city2.profit - city1.profit),
  [barchartData],
  )

  return (
    <Card>
      <Group justify="space-between" mb="lg">
        <Title order={3}>Прибыль по городам</Title>
        <YearSelect
          value={selectedYear ?? availableYears[0]}
          onChange={setSelectedYear}
          years={availableYears}
        />
      </Group>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={sortedCitiesData} layout="vertical">
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
              color: '#fff',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontFamily: 'Manrope',
            }}
            wrapperStyle={{ zIndex: 10 }}
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

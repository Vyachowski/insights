import { Box, Group, Text, Title } from '@mantine/core'
import Card from '@ui/Card'
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts'

import type { YearlyProfitTrendPoint } from '@insights/contracts'

export default function YearlyProfitTrendChart({ data }: { data: YearlyProfitTrendPoint[] }) {
  return (
    <Card>
      <Title order={3} mb="lg">Годовой тренд прибыли</Title>

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

      <Group gap="lg" mt="md">
        <Group gap="xs">
          <Box w={16} h={16} bg="#10b981" style={{ borderRadius: '50%' }} />
          <Text size="sm" c="dimmed">Текущий год</Text>
        </Group>
        <Group gap="xs">
          <Box w={16} h={16} bg="#475569" style={{ borderRadius: '50%' }} />
          <Text size="sm" c="dimmed">Прошлый год</Text>
        </Group>
      </Group>
    </Card>
  )
}

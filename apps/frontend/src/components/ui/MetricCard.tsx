import { Badge, Group, Text } from '@mantine/core'
import { TrendingDown, TrendingUp } from 'lucide-react'

import Card from './Card.tsx'

import { formatNumber } from '@/lib/utils.ts'

export default function MetricCard({
  title,
  value,
  trend,
  isProfit,
}: {
  title: string;
  value: number | null;
  trend?: number;
  isProfit?: boolean;
}) {
  return (
    <Card size="md">
      <Text size="sm" c="dimmed" fw={500} tt="uppercase" mb="sm">
        {title}
      </Text>
      <Group justify="space-between" align="flex-end">
        <Text fz={36} fw={700}>
          {value ? (
            <>
              {formatNumber(value)}
              <Text span size="lg" c="dimmed" ml={4}>₽</Text>
            </>
          ) : '—'}
        </Text>
        {trend !== undefined && (
          <Badge
            color={isProfit ? 'teal' : 'red'}
            variant="light"
            size="lg"
            leftSection={trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          >
            {Math.abs(trend)}%
          </Badge>
        )}
      </Group>
    </Card>
  )
}

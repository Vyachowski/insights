import { Group, ScrollArea, Stack, Text } from '@mantine/core'
import Card from '@ui/Card'
import { useState } from 'react'

import TargetBar from './TargetBar'
import ValueModeToggle, { type ValueMode } from './ValueModeToggle'

import type { CityCallsDto } from '@/lib/types'

import { formatDeltaPercent, formatNumber } from '@/lib/utils'

export default function CallsByCityWidget({ cities }: { cities: CityCallsDto[] }) {
  const [mode, setMode] = useState<ValueMode>('pct')

  return (
    <Card>
      <Group justify="space-between" mb="lg">
        <Text fz="xl" fw={700}>Звонки по городам</Text>
        <ValueModeToggle value={mode} onChange={setMode} />
      </Group>

      <ScrollArea.Autosize mah={440} type="auto">
        <Stack gap="md" pr="sm">
          {cities.map((city, index) => (
            <Group key={city.city} wrap="nowrap" gap="md">
              <Text w={150} size="sm" truncate>{city.city}</Text>
              <TargetBar
                current={city.current}
                previous={city.previous}
                showYearLabel={index === 0}
                tooltip={
                  mode === 'pct'
                    ? `${formatDeltaPercent(city.current, city.previous)} к 2025`
                    : `${formatNumber(city.current)} звонков`
                }
              />
            </Group>
          ))}
        </Stack>
      </ScrollArea.Autosize>
    </Card>
  )
}

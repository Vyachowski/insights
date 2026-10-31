import { Box, Group, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import PeriodFilters from '@ui/PeriodFilters'
import TablePager from '@ui/TablePager'
import { Upload } from 'lucide-react'

import type { PeriodFilter } from '@/hooks/usePeriodFilter'
import type { SiteMetric } from '@/server/db/metrics'
import type { Site } from '@/server/db/sites'

import { useTable } from '@/hooks/useTable'
import { formatDate, getSiteName } from '@/lib/utils'

interface Props {
  entries: SiteMetric[]
  sites: Site[]
  period: PeriodFilter
  onImportClick: () => void
}

export default function MetricsTabView({ entries, sites, period, onImportClick }: Props) {
  const table = useTable(entries)

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" gap="md">
        <Box>
          <Title order={4}>SEO-метрики</Title>
          <Text c="dimmed" size="sm">
            {`${entries.length} записей`}
          </Text>
        </Box>
        <Group gap="sm">
          <Button size="sm" variant="secondary" onClick={onImportClick}>
            <Upload size={15} />
            Импорт CSV
          </Button>
        </Group>
      </Group>

      <PeriodFilters period={period} />

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <ScrollArea.Autosize mah={480}>
          <Table stickyHeader highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Дата</Table.Th>
                <Table.Th>Сайт</Table.Th>
                <Table.Th ta="right">Яндекс</Table.Th>
                <Table.Th ta="right">Google</Table.Th>
                <Table.Th ta="right">Прочие</Table.Th>
                <Table.Th ta="right">Лиды</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {table.rows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" size="sm" py={64}>Нет метрик за {period.effectiveYear} год</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                table.rows.map(entry => (
                  <Table.Tr key={entry.id}>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{formatDate(entry.date)}</Table.Td>
                    <Table.Td>{getSiteName(entry.siteId, sites)}</Table.Td>
                    <Table.Td ta="right">{entry.yandexUsers.toLocaleString('ru-RU')}</Table.Td>
                    <Table.Td ta="right">{entry.googleUsers.toLocaleString('ru-RU')}</Table.Td>
                    <Table.Td ta="right" c="dimmed">{entry.otherUsers.toLocaleString('ru-RU')}</Table.Td>
                    <Table.Td ta="right">
                      <Text span c="teal" fw={500}>
                        {entry.leadsYandex + entry.leadsGoogle + entry.leadsOther}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea.Autosize>
        <TablePager table={table} />
      </Paper>
    </Stack>
  )
}

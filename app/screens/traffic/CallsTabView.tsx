import { Badge, Box, Group, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import PeriodFilters from '@ui/PeriodFilters'
import TablePager from '@ui/TablePager'
import { Upload } from 'lucide-react'

import type { PeriodFilter } from '@/hooks/usePeriodFilter'
import type { CallListRow } from '@/server/db/calls'

import { useTable } from '@/hooks/useTable'
import { formatDate } from '@/lib/utils'

interface Props {
  entries: CallListRow[]
  period: PeriodFilter
  onImportClick: () => void
}

export default function CallsTabView({ entries, period, onImportClick }: Props) {
  const table = useTable(entries)

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" gap="md">
        <Box>
          <Title order={4}>Звонки</Title>
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
                <Table.Th>Откуда</Table.Th>
                <Table.Th>Город</Table.Th>
                <Table.Th>Канал</Table.Th>
                <Table.Th ta="right">№</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {table.rows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" size="sm" py={64}>Нет звонков за {period.effectiveYear} год</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                table.rows.map(entry => (
                  <Table.Tr key={entry.id}>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{formatDate(entry.date)}</Table.Td>
                    <Table.Td ff="monospace">{entry.src}</Table.Td>
                    <Table.Td>
                      {entry.city
                        ? <Badge variant="light" color="gray" size="sm" tt="capitalize">{entry.city}</Badge>
                        : <Text c="dimmed" size="sm">—</Text>}
                    </Table.Td>
                    <Table.Td c="dimmed">{entry.channel || '—'}</Table.Td>
                    <Table.Td ta="right" c="dimmed">{entry.callNumber}</Table.Td>
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

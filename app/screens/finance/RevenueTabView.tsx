import { ActionIcon, Box, Group, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import PeriodFilters from '@ui/PeriodFilters'
import TablePager from '@ui/TablePager'
import { Plus, Trash2, Upload } from 'lucide-react'

import AddRevenueModal from './AddRevenueModal'

import type { PeriodFilter } from '@/hooks/usePeriodFilter'
import type { Revenue } from '@/server/db/revenues'
import type { Site } from '@/server/db/sites'

import { useTable } from '@/hooks/useTable'
import { formatAmount, formatDate, getSiteName } from '@/lib/utils'

interface Props {
  entries: Revenue[]
  sites: Site[]
  isAdmin: boolean
  period: PeriodFilter
  showModal: boolean
  submitting: boolean
  onImportClick: () => void
  onAddClick: () => void
  onRemove: (id: number) => void
  onModalClose: () => void
  onModalSubmit: (values: { date: string, siteId: string, amount: string }) => void
}

export default function RevenueTabView({ entries, sites, isAdmin, period, showModal, submitting, onImportClick, onAddClick, onRemove, onModalClose, onModalSubmit }: Props) {
  const table = useTable(entries)
  const total = entries.reduce((sum, e) => sum + e.amount, 0)

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" gap="md">
        <Box>
          <Title order={4}>Доходы</Title>
          <Text c="dimmed" size="sm">
            {`${entries.length} записей · итого ${formatAmount(total)}`}
          </Text>
        </Box>
        <Group gap="sm">
          <Button size="sm" variant="secondary" onClick={onImportClick}>
            <Upload size={15} />
            Импорт CSV
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={onAddClick}>
              <Plus size={16} />
              Добавить
            </Button>
          )}
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
                <Table.Th ta="right">Сумма</Table.Th>
                <Table.Th w={48} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {table.rows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" c="dimmed" size="sm" py={64}>Нет записей за {period.effectiveYear} год</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                table.rows.map(entry => (
                  <Table.Tr key={entry.id}>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{formatDate(entry.date)}</Table.Td>
                    <Table.Td>
                      {entry.siteId === null
                        ? <Text span c="dimmed" fs="italic">Общий</Text>
                        : getSiteName(entry.siteId, sites)}
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text span c="teal" fw={600}>{formatAmount(entry.amount)}</Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      {isAdmin && (
                        <ActionIcon variant="subtle" color="red" onClick={() => onRemove(entry.id)}>
                          <Trash2 size={15} />
                        </ActionIcon>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea.Autosize>
        <TablePager table={table} />
      </Paper>

      {isAdmin && showModal && (
        <AddRevenueModal onClose={onModalClose} onSubmit={onModalSubmit} submitting={submitting} sites={sites} />
      )}
    </Stack>
  )
}

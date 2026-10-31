import { Badge, Box, Group, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import CategorySelect from '@ui/CategorySelect'
import PeriodFilters from '@ui/PeriodFilters'
import TablePager from '@ui/TablePager'
import { Plus, Upload } from 'lucide-react'

import type { PeriodFilter } from '@/hooks/usePeriodFilter'
import type { Expense } from '@/server/db/queries/expenses'
import type { Site } from '@/server/db/queries/sites'

import { useTable } from '@/hooks/useTable'
import { formatAmount, formatDate, getSiteName, sumAmounts } from '@/lib/utils'

interface Props {
  entries: Expense[]
  sites: Site[]
  isAdmin: boolean
  period: PeriodFilter
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  onImportClick: () => void
  onAddClick: () => void
}

export default function ExpensesTabView({ entries, sites, isAdmin, period, categories, selectedCategory, onCategoryChange, onImportClick, onAddClick }: Props) {
  const table = useTable(entries)
  const total = sumAmounts(entries)

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" gap="md">
        <Box>
          <Title order={4}>Расходы</Title>
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

      <PeriodFilters period={period}>
        {categories.length > 0 && (
          <CategorySelect value={selectedCategory} onChange={onCategoryChange} categories={categories} />
        )}
      </PeriodFilters>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <ScrollArea.Autosize mah={480}>
          <Table stickyHeader highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Дата</Table.Th>
                <Table.Th>Тип</Table.Th>
                <Table.Th>Сайт</Table.Th>
                <Table.Th ta="right">Сумма</Table.Th>
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
                    <Table.Td><Badge variant="light" color="gray" size="sm">{entry.type}</Badge></Table.Td>
                    <Table.Td>
                      {entry.siteId === null
                        ? <Text span c="dimmed" fs="italic">Общий</Text>
                        : getSiteName(entry.siteId, sites)}
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text span c="red" fw={600}>{formatAmount(entry.amount)}</Text>
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

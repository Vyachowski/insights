import { Badge, Box, Group, Pagination, Paper, ScrollArea, Skeleton, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import CategorySelect from '@ui/CategorySelect'
import MonthSelect from '@ui/MonthSelect'
import YearSelect from '@ui/YearSelect'
import { Upload } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { ApiError, ExpenseDto as Expense, SiteDto as Site } from '@/lib/types'

const PAGE_SIZE = 20

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getSiteName(siteId: number | null, sites: Site[]) {
  if (siteId === null) return null
  const site = sites.find(s => s.id === siteId)
  if (!site) return `Сайт #${siteId}`
  try { return new URL(site.url).hostname } catch { return site.url }
}

interface Props {
  loading: boolean
  error: ApiError | null
  entries: Expense[]
  sites: Site[]
  effectiveYear: number | null
  availableYears: number[]
  availableMonths: number[]
  effectiveMonth: number | null
  categories: string[]
  selectedCategory: string | null
  onYearChange: (year: number | null) => void
  onMonthChange: (month: number | null) => void
  onCategoryChange: (category: string | null) => void
  onImportClick: () => void
}

export default function ExpensesTabView({ loading, error, entries, sites, effectiveYear, availableYears, availableMonths, effectiveMonth, categories, selectedCategory, onYearChange, onMonthChange, onCategoryChange, onImportClick }: Props) {
  const [page, setPage] = useState(1)

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries],
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const pageEntries = sorted.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)
  const total = entries.reduce((sum, e) => sum + e.amount, 0)

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" gap="md">
        <Box>
          <Title order={4}>Расходы</Title>
          <Text c="dimmed" size="sm">
            {loading ? 'Загрузка...' : `${entries.length} записей · итого ${formatAmount(total)}`}
          </Text>
        </Box>
        <Group gap="sm">
          <Button size="sm" variant="secondary" onClick={onImportClick}>
            <Upload size={15} />
            Импорт CSV
          </Button>
        </Group>
      </Group>

      {((availableYears.length > 0 && effectiveYear) || availableMonths.length > 0 || categories.length > 0) && (
        <Group gap="sm">
          {availableYears.length > 0 && effectiveYear && (
            <YearSelect value={effectiveYear} onChange={onYearChange} years={availableYears} />
          )}
          {availableMonths.length > 0 && (
            <MonthSelect value={effectiveMonth} onChange={onMonthChange} months={availableMonths} />
          )}
          {categories.length > 0 && (
            <CategorySelect value={selectedCategory} onChange={onCategoryChange} categories={categories} />
          )}
        </Group>
      )}

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        {error ? (
          <Text c="red" ta="center" size="sm" py={64}>{error.message}</Text>
        ) : (
          <>
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
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <Table.Tr key={i}>
                        <Table.Td><Skeleton h={16} w={90} /></Table.Td>
                        <Table.Td><Skeleton h={16} w={90} /></Table.Td>
                        <Table.Td><Skeleton h={16} w={150} /></Table.Td>
                        <Table.Td><Skeleton h={16} w={80} ml="auto" /></Table.Td>
                      </Table.Tr>
                    ))
                  ) : pageEntries.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={4}>
                        <Text ta="center" c="dimmed" size="sm" py={64}>Нет записей за {effectiveYear} год</Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    pageEntries.map(entry => (
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
            {!loading && totalPages > 1 && (
              <Group justify="space-between" p="sm" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
                <Text size="xs" c="dimmed">
                  {(clampedPage - 1) * PAGE_SIZE + 1}–{Math.min(clampedPage * PAGE_SIZE, sorted.length)} из {sorted.length}
                </Text>
                <Pagination value={clampedPage} onChange={setPage} total={totalPages} size="sm" />
              </Group>
            )}
          </>
        )}
      </Paper>
    </Stack>
  )
}

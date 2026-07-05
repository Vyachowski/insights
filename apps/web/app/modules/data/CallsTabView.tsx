import { Badge, Box, Group, Pagination, Paper, ScrollArea, Skeleton, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import YearSelect from '@ui/YearSelect'
import { Upload } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { ApiError, CallImportDto as CallImport } from '@/lib/types'

const PAGE_SIZE = 20

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface Props {
  loading: boolean
  error: ApiError | null
  entries: CallImport[]
  effectiveYear: number | null
  availableYears: number[]
  onYearChange: (year: number | null) => void
  onImportClick: () => void
}

export default function CallsTabView({ loading, error, entries, effectiveYear, availableYears, onYearChange, onImportClick }: Props) {
  const [page, setPage] = useState(1)

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries],
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const pageEntries = sorted.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="wrap" gap="md">
        <Box>
          <Title order={4}>Звонки</Title>
          <Text c="dimmed" size="sm">
            {loading ? 'Загрузка...' : `${entries.length} записей`}
          </Text>
        </Box>
        <Group gap="sm">
          {availableYears.length > 0 && effectiveYear && (
            <YearSelect value={effectiveYear} onChange={onYearChange} years={availableYears} />
          )}
          <Button size="sm" variant="secondary" onClick={onImportClick}>
            <Upload size={15} />
            Импорт CSV
          </Button>
        </Group>
      </Group>

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
                    <Table.Th>Откуда</Table.Th>
                    <Table.Th>Город</Table.Th>
                    <Table.Th>Канал</Table.Th>
                    <Table.Th ta="right">№</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <Table.Tr key={i}>
                        <Table.Td><Skeleton h={16} w={90} /></Table.Td>
                        <Table.Td><Skeleton h={16} w={120} /></Table.Td>
                        <Table.Td><Skeleton h={16} w={100} /></Table.Td>
                        <Table.Td><Skeleton h={16} w={130} /></Table.Td>
                        <Table.Td><Skeleton h={16} w={40} ml="auto" /></Table.Td>
                      </Table.Tr>
                    ))
                  ) : pageEntries.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text ta="center" c="dimmed" size="sm" py={64}>Нет звонков за {effectiveYear} год</Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    pageEntries.map(entry => (
                      <Table.Tr key={entry.id}>
                        <Table.Td style={{ whiteSpace: 'nowrap' }}>{formatDate(entry.date)}</Table.Td>
                        <Table.Td ff="monospace">{entry.src}</Table.Td>
                        <Table.Td><Badge variant="light" color="gray" size="sm" tt="capitalize">{entry.projectTitle}</Badge></Table.Td>
                        <Table.Td c="dimmed">{entry.advChannelName || '—'}</Table.Td>
                        <Table.Td ta="right" c="dimmed">{entry.callNumber}</Table.Td>
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

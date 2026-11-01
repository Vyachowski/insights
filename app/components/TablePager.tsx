import { Group, Pagination, Text } from '@mantine/core'

import type { Table } from '@/hooks/useTable'

export default function TablePager({ table }: { table: Table }) {
  if (table.totalPages <= 1) return null

  return (
    <Group justify="space-between" p="sm" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
      <Text size="xs" c="dimmed">
        {table.firstRow}–{table.lastRow} из {table.total}
      </Text>
      <Pagination value={table.page} onChange={table.setPage} total={table.totalPages} size="sm" />
    </Group>
  )
}

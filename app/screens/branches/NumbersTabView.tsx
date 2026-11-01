import { Badge, Box, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'

import type { Site } from '@/server/db/queries/sites'
import type { NumberCharge } from '@/server/services/auto-charges'

import { formatAmount, formatDate, getSiteName } from '@/lib/utils'

export default function NumbersTabView({ numbers, sites }: { numbers: NumberCharge[]; sites: Site[] }) {
  return (
    <Stack gap="md">
      <Box>
        <Title order={4}>Номера</Title>
        <Text c="dimmed" size="sm">
          {`${numbers.length} номеров`}
        </Text>
      </Box>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <ScrollArea.Autosize mah={480}>
          <Table stickyHeader highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Номер</Table.Th>
                <Table.Th>Название</Table.Th>
                <Table.Th>Сайт</Table.Th>
                <Table.Th>Автосписание</Table.Th>
                <Table.Th>Следующая дата</Table.Th>
                <Table.Th ta="right">Сумма</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {numbers.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" size="sm" py={64}>Нет данных</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                numbers.map(row => (
                  <Table.Tr key={`${row.provider}:${row.providerNumberId}`}>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{row.number ?? '—'}</Table.Td>
                    <Table.Td>{row.name ?? '—'}</Table.Td>
                    <Table.Td c="dimmed">{getSiteName(row.siteId, sites) ?? '—'}</Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={row.enabled ? 'teal' : 'gray'} size="sm">
                        {row.enabled ? 'Включено' : 'Выключено'}
                      </Badge>
                    </Table.Td>
                    <Table.Td c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                      {row.nextDate ? formatDate(row.nextDate) : '—'}
                    </Table.Td>
                    <Table.Td ta="right">{row.amount === null ? '—' : formatAmount(row.amount)}</Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea.Autosize>
      </Paper>
    </Stack>
  )
}

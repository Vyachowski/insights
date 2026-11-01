import { Badge, Box, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'

import type { Hosting } from '@/server/db/queries/hostings'

export default function HostingsTabView({ hostings }: { hostings: Hosting[] }) {
  return (
    <Stack gap="md">
      <Box>
        <Title order={4}>Хостинг</Title>
        <Text c="dimmed" size="sm">
          {`Хостингов: ${hostings.length}`}
        </Text>
      </Box>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <ScrollArea.Autosize mah={480}>
          <Table stickyHeader highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Провайдер</Table.Th>
                <Table.Th>Аккаунт</Table.Th>
                <Table.Th ta="right">Сайтов</Table.Th>
                <Table.Th>Автосписание</Table.Th>
                <Table.Th>Следующая дата</Table.Th>
                <Table.Th ta="right">Сумма</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {hostings.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" size="sm" py={64}>Нет данных</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                hostings.map(row => (
                  <Table.Tr key={row.id}>
                    <Table.Td>{row.provider}</Table.Td>
                    <Table.Td>{row.account}</Table.Td>
                    <Table.Td ta="right">{row.siteCount}</Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="gray" size="sm">Выключено</Badge>
                    </Table.Td>
                    <Table.Td c="dimmed">—</Table.Td>
                    <Table.Td ta="right">—</Table.Td>
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

import { Box, Code, Group, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import { MapPin, Plus } from 'lucide-react'

import type { City } from '@/server/db/queries/cities'

function formatPopulation(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export default function CitiesTabView({ cities }: { cities: City[] }) {
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Box>
          <Title order={4}>Города</Title>
          <Text c="dimmed" size="sm">
            {`${cities.length} городов`}
          </Text>
        </Box>
        <Button size="sm" disabled title="Добавление городов пока недоступно">
          <Plus size={16} />
          Добавить
        </Button>
      </Group>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <ScrollArea.Autosize mah={480}>
          <Table stickyHeader highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Город</Table.Th>
                <Table.Th>Код</Table.Th>
                <Table.Th ta="right">Население</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {cities.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text ta="center" c="dimmed" size="sm" py={64}>Нет данных</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                cities.map(city => (
                  <Table.Tr key={city.id}>
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <MapPin size={14} color="var(--mantine-color-dimmed)" />
                        <Text fw={500}>{city.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td><Code>{city.code}</Code></Table.Td>
                    <Table.Td ta="right" c="dimmed">{formatPopulation(city.population)}</Table.Td>
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

import { Box, Code, Group, Paper, ScrollArea, Skeleton, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import { MapPin, Plus } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch } from '@/store'

import { selectCities, selectCitiesError, selectCitiesLoading } from '@/store/selectors/citiesSelectors'
import { fetchCities } from '@/store/thunks/citiesThunks'

function formatPopulation(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export default function CitiesTab() {
  const dispatch = useDispatch<AppDispatch>()
  const cities = useSelector(selectCities)
  const loading = useSelector(selectCitiesLoading)
  const error = useSelector(selectCitiesError)

  useEffect(() => { dispatch(fetchCities()) }, [dispatch])

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Box>
          <Title order={4}>Города</Title>
          <Text c="dimmed" size="sm">
            {loading ? 'Загрузка...' : `${cities.length} городов`}
          </Text>
        </Box>
        <Button size="sm" disabled title="Добавление городов пока недоступно">
          <Plus size={16} />
          Добавить
        </Button>
      </Group>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        {error ? (
          <Text c="red" ta="center" size="sm" py={64}>{error.message}</Text>
        ) : (
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
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Table.Tr key={i}>
                      <Table.Td><Skeleton h={16} w={130} /></Table.Td>
                      <Table.Td><Skeleton h={16} w={50} /></Table.Td>
                      <Table.Td><Skeleton h={16} w={80} ml="auto" /></Table.Td>
                    </Table.Tr>
                  ))
                ) : cities.length === 0 ? (
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
        )}
      </Paper>
    </Stack>
  )
}

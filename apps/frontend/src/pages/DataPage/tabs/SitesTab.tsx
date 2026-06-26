import { Anchor, Box, Group, Paper, ScrollArea, Skeleton, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import { Globe, Plus } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch } from '@/store'

import { selectCities, selectCitiesError, selectCitiesLoading } from '@/store/selectors/citiesSelectors'
import { selectSites, selectSitesError, selectSitesLoading } from '@/store/selectors/sitesSelectors'
import { fetchCities } from '@/store/thunks/citiesThunks'
import { fetchSites } from '@/store/thunks/sitesThunks'

function getHostname(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

export default function SitesTab() {
  const dispatch = useDispatch<AppDispatch>()
  const sites = useSelector(selectSites)
  const cities = useSelector(selectCities)
  const sitesLoading = useSelector(selectSitesLoading)
  const citiesLoading = useSelector(selectCitiesLoading)
  const sitesError = useSelector(selectSitesError)
  const citiesError = useSelector(selectCitiesError)
  const loading = sitesLoading || citiesLoading
  const error = sitesError ?? citiesError

  useEffect(() => {
    dispatch(fetchSites())
    dispatch(fetchCities())
  }, [dispatch])

  function getCityName(cityId: number) {
    return cities.find(c => c.id === cityId)?.name ?? `Город #${cityId}`
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Box>
          <Title order={4}>Сайты</Title>
          <Text c="dimmed" size="sm">
            {loading ? 'Загрузка...' : `${sites.length} сайтов`}
          </Text>
        </Box>
        <Button size="sm" disabled title="Добавление сайтов пока недоступно">
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
                  <Table.Th>Сайт</Table.Th>
                  <Table.Th>Город</Table.Th>
                  <Table.Th>Группа</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <Table.Tr key={i}>
                      <Table.Td><Skeleton h={16} w={180} /></Table.Td>
                      <Table.Td><Skeleton h={16} w={100} /></Table.Td>
                      <Table.Td><Skeleton h={16} w={60} /></Table.Td>
                    </Table.Tr>
                  ))
                ) : sites.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <Text ta="center" c="dimmed" size="sm" py={64}>Нет данных</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  sites.map(site => (
                    <Table.Tr key={site.id}>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          <Globe size={14} color="var(--mantine-color-dimmed)" />
                          <Anchor href={site.url} target="_blank" rel="noopener noreferrer" size="sm">
                            {getHostname(site.url)}
                          </Anchor>
                        </Group>
                      </Table.Td>
                      <Table.Td c="dimmed">{getCityName(site.cityId)}</Table.Td>
                      <Table.Td c="dimmed">{site.group ?? '—'}</Table.Td>
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

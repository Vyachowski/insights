import { Anchor, Box, Group, Paper, ScrollArea, Skeleton, Stack, Table, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import { Globe, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { City, Site } from '@insights/contracts'

import { citiesApi } from '@/api/cities'
import { sitesApi } from '@/api/sites'

function getHostname(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

export default function SitesTab() {
  const [sites, setSites] = useState<Site[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([sitesApi.fetchAll(), citiesApi.fetchAll()])
      .then(([siteList, cityList]) => { setSites(siteList); setCities(cityList) })
      .catch(e => setError(e?.message ?? 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

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
          <Text c="red" ta="center" size="sm" py={64}>{error}</Text>
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

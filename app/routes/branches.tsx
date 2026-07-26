import { Container, Tabs } from '@mantine/core'
import { useSearchParams } from 'react-router'

import type { Route } from './+types/branches'

import CitiesTabView from '@/modules/data/CitiesTabView'
import SitesTabView from '@/modules/data/SitesTabView'
import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { cities, sites } from '@/server/schema'

const TABS = [
  { id: 'cities', label: 'Города' },
  { id: 'sites', label: 'Сайты' },
] as const

type TabId = (typeof TABS)[number]['id']

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)

  const [allSites, allCities] = await Promise.all([
    db.select().from(sites).orderBy(sites.id),
    db.select().from(cities).orderBy(cities.id),
  ])

  return { sites: allSites, cities: allCities }
}

export default function BranchesPage({ loaderData: data }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') ?? 'cities') as TabId

  return (
    <Container size="xl" px={0}>
      <Tabs
        value={activeTab}
        onChange={value => setSearchParams({ tab: value ?? 'cities' })}
        keepMounted={false}
      >
        <Tabs.List mb="md">
          {TABS.map(tab => (
            <Tabs.Tab key={tab.id} value={tab.id}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="cities">
          <CitiesTabView cities={data.cities} />
        </Tabs.Panel>
        <Tabs.Panel value="sites">
          <SitesTabView sites={data.sites} cities={data.cities} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

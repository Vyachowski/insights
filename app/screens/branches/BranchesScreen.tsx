import { Container, Tabs } from '@mantine/core'
import { useSearchParams } from 'react-router'

import CitiesTabView from './CitiesTabView'
import SitesTabView from './SitesTabView'

import type { City } from '@/server/db/cities'
import type { Site } from '@/server/db/sites'

const TABS = [
  { id: 'cities', label: 'Города' },
  { id: 'sites', label: 'Сайты' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function BranchesScreen({ sites, cities }: { sites: Site[], cities: City[] }) {
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
          <CitiesTabView cities={cities} />
        </Tabs.Panel>
        <Tabs.Panel value="sites">
          <SitesTabView sites={sites} cities={cities} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

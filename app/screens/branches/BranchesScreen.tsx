import { Container, Tabs } from '@mantine/core'
import { useSearchParams } from 'react-router'

import CitiesTabView from './CitiesTabView'
import HostingsTabView from './HostingsTabView'
import NumbersTabView from './NumbersTabView'
import SitesTabView from './SitesTabView'

import type { City } from '@/server/db/queries/cities'
import type { Hosting } from '@/server/db/queries/hostings'
import type { Site } from '@/server/db/queries/sites'
import type { NumberCharge } from '@/server/services/auto-charges'

import { useAuth } from '@/hooks/useAuth'

const TABS = [
  { id: 'cities', label: 'Города' },
  { id: 'sites', label: 'Сайты' },
  { id: 'numbers', label: 'Номера' },
  { id: 'hostings', label: 'Хостинг' },
] as const

type TabId = (typeof TABS)[number]['id']

interface Props {
  sites: Site[]
  cities: City[]
  numbers: NumberCharge[]
  hostings: Hosting[]
}

export default function BranchesScreen({ sites, cities, numbers, hostings }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
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
        <Tabs.Panel value="numbers">
          <NumbersTabView numbers={numbers} sites={sites} isAdmin={user?.isAdmin ?? false} />
        </Tabs.Panel>
        <Tabs.Panel value="hostings">
          <HostingsTabView hostings={hostings} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

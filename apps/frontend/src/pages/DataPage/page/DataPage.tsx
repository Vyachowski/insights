import { Container, Tabs } from '@mantine/core'
import { useState } from 'react'

import CallsTab from '../tabs/CallsTab'
import CitiesTab from '../tabs/CitiesTab'
import ExpensesTab from '../tabs/ExpensesTab'
import MetricsTab from '../tabs/MetricsTab'
import RevenueTab from '../tabs/RevenueTab'
import SitesTab from '../tabs/SitesTab'

const tabs = [
  { id: 'revenue', label: 'Доходы' },
  { id: 'expenses', label: 'Расходы' },
  { id: 'calls', label: 'Звонки' },
  { id: 'metrics', label: 'Метрики' },
  { id: 'cities', label: 'Города' },
  { id: 'sites', label: 'Сайты' },
] as const

type TabId = typeof tabs[number]['id']

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<TabId>('revenue')

  return (
    <Container size="xl" px={0}>
      <Tabs value={activeTab} onChange={value => setActiveTab(value as TabId)} keepMounted={false}>
        <Tabs.List mb="md">
          {tabs.map(tab => (
            <Tabs.Tab key={tab.id} value={tab.id}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="revenue"><RevenueTab /></Tabs.Panel>
        <Tabs.Panel value="expenses"><ExpensesTab /></Tabs.Panel>
        <Tabs.Panel value="calls"><CallsTab /></Tabs.Panel>
        <Tabs.Panel value="metrics"><MetricsTab /></Tabs.Panel>
        <Tabs.Panel value="cities"><CitiesTab /></Tabs.Panel>
        <Tabs.Panel value="sites"><SitesTab /></Tabs.Panel>
      </Tabs>
    </Container>
  )
}

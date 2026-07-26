import { Container, Tabs } from '@mantine/core'
import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { useState } from 'react'
import { useRevalidator, useSearchParams } from 'react-router'

import type { Route } from './+types/traffic'

import { usePeriodFilter } from '@/hooks/usePeriodFilter'
import { importFile, importUrl } from '@/lib/importClient'
import CallsTabView from '@/modules/data/CallsTabView'
import MetricsTabView from '@/modules/data/MetricsTabView'
import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { callImports, siteMetrics, sites } from '@/server/schema'

const TABS = [
  { id: 'calls', label: 'Звонки' },
  { id: 'metrics', label: 'Метрики' },
] as const

type TabId = (typeof TABS)[number]['id']

const IMPORT_TITLES: Record<string, string> = {
  calls: 'Импорт звонков',
  metrics: 'Импорт метрик',
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)

  const tab = new URL(request.url).searchParams.get('tab') ?? 'calls'

  const [entries, allSites] = await Promise.all([
    fetchEntries(tab),
    db.select().from(sites).orderBy(sites.id),
  ])

  return { tab, entries, sites: allSites }
}

async function fetchEntries(tab: string) {
  switch (tab) {
    case 'metrics':
      return db.select().from(siteMetrics).orderBy(siteMetrics.id)
    case 'calls':
    default:
      return db.select().from(callImports).orderBy(callImports.id)
  }
}

export default function TrafficPage({ loaderData: data }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const revalidator = useRevalidator()

  const activeTab = (searchParams.get('tab') ?? 'calls') as TabId
  const [importTarget, setImportTarget] = useState<string | null>(null)

  const period = usePeriodFilter(data.entries as { date: string | Date }[])

  const importConfig: CsvImportConfig | null = importTarget
    ? {
      title: IMPORT_TITLES[importTarget],
      onImportFile: file => importFile(importTarget, file),
      onImportUrl: url => importUrl(importTarget, url),
      onSuccess: () => revalidator.revalidate(),
    }
    : null

  const commonProps = {
    loading: false,
    error: null,
    effectiveYear: period.effectiveYear,
    availableYears: period.availableYears,
    onYearChange: period.setSelectedYear,
    availableMonths: period.availableMonths,
    effectiveMonth: period.effectiveMonth,
    onMonthChange: period.setSelectedMonth,
  }

  return (
    <Container size="xl" px={0}>
      <Tabs
        value={activeTab}
        onChange={value => setSearchParams({ tab: value ?? 'calls' })}
        keepMounted={false}
      >
        <Tabs.List mb="md">
          {TABS.map(tab => (
            <Tabs.Tab key={tab.id} value={tab.id}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="calls">
          <CallsTabView
            {...commonProps}
            entries={period.filtered as never}
            onImportClick={() => setImportTarget('calls')}
          />
        </Tabs.Panel>
        <Tabs.Panel value="metrics">
          <MetricsTabView
            {...commonProps}
            entries={period.filtered as never}
            sites={data.sites}
            onImportClick={() => setImportTarget('metrics')}
          />
        </Tabs.Panel>
      </Tabs>

      {importConfig && (
        <CsvImportModal config={importConfig} onClose={() => setImportTarget(null)} />
      )}
    </Container>
  )
}

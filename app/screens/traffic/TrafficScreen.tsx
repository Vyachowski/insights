import { Container, Tabs } from '@mantine/core'
import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { useState } from 'react'
import { useRevalidator, useSearchParams } from 'react-router'

import CallsTabView from './CallsTabView'
import MetricsTabView from './MetricsTabView'

import type { CallListRow } from '@/server/db/calls'
import type { SiteMetric } from '@/server/db/metrics'
import type { Site } from '@/server/db/sites'

import { usePeriodFilter } from '@/hooks/usePeriodFilter'
import { importFile, importUrl } from '@/lib/importClient'

const TABS = [
  { id: 'calls', label: 'Звонки' },
  { id: 'metrics', label: 'Метрики' },
] as const

type TabId = (typeof TABS)[number]['id']

const IMPORT_TITLES: Record<string, string> = {
  calls: 'Импорт звонков',
  metrics: 'Импорт метрик',
}

interface Props {
  calls: CallListRow[]
  metrics: SiteMetric[]
  sites: Site[]
}

export default function TrafficScreen({ calls, metrics, sites }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const revalidator = useRevalidator()

  const activeTab = (searchParams.get('tab') ?? 'calls') as TabId
  const [importTarget, setImportTarget] = useState<string | null>(null)

  const period = usePeriodFilter(activeTab === 'metrics' ? metrics : calls)

  const importConfig: CsvImportConfig | null = importTarget
    ? {
      title: IMPORT_TITLES[importTarget],
      onImportFile: file => importFile(importTarget, file),
      onImportUrl: url => importUrl(importTarget, url),
      onSuccess: () => revalidator.revalidate(),
    }
    : null

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
            period={period}
            entries={calls.filter(period.matches)}
            onImportClick={() => setImportTarget('calls')}
          />
        </Tabs.Panel>
        <Tabs.Panel value="metrics">
          <MetricsTabView
            period={period}
            entries={metrics.filter(period.matches)}
            sites={sites}
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

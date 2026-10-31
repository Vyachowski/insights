import { Container, Tabs } from '@mantine/core'
import CsvImportModal from '@ui/CsvImportModal'
import { useSearchParams } from 'react-router'

import CallsTabView from './CallsTabView'
import MetricsTabView from './MetricsTabView'

import type { CallListRow } from '@/server/db/queries/calls'
import type { SiteMetric } from '@/server/db/queries/metrics'
import type { Site } from '@/server/db/queries/sites'

import { useCsvImport } from '@/hooks/useCsvImport'
import { usePeriodFilter, usePeriodRows } from '@/hooks/usePeriodFilter'

const TABS = [
  { id: 'calls', label: 'Звонки' },
  { id: 'metrics', label: 'Метрики' },
] as const

type TabId = (typeof TABS)[number]['id']

const IMPORT_TITLES = {
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

  const activeTab = (searchParams.get('tab') ?? 'calls') as TabId
  const csvImport = useCsvImport(IMPORT_TITLES)

  const period = usePeriodFilter(activeTab === 'metrics' ? metrics : calls)

  const callEntries = usePeriodRows(calls, period)
  const metricEntries = usePeriodRows(metrics, period)

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
            entries={callEntries}
            onImportClick={() => csvImport.open('calls')}
          />
        </Tabs.Panel>
        <Tabs.Panel value="metrics">
          <MetricsTabView
            period={period}
            entries={metricEntries}
            sites={sites}
            onImportClick={() => csvImport.open('metrics')}
          />
        </Tabs.Panel>
      </Tabs>

      {csvImport.config && (
        <CsvImportModal config={csvImport.config} onClose={csvImport.close} />
      )}
    </Container>
  )
}

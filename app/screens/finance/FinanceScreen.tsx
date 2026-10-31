import { Container, Tabs } from '@mantine/core'
import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { useMemo, useState } from 'react'
import { useFetcher, useRevalidator, useSearchParams } from 'react-router'

import AddHostingModal from './AddHostingModal'
import ExpensesTabView from './ExpensesTabView'
import RevenueTabView from './RevenueTabView'

import type { getFinancePage } from '@/server/services/finance'

import { type ActionResult, useActionToast } from '@/hooks/useActionToast'
import { useAuth } from '@/hooks/useAuth'
import { usePeriodFilter } from '@/hooks/usePeriodFilter'
import { importFile, importUrl } from '@/lib/importClient'

const TABS = [
  { id: 'revenue', label: 'Доходы' },
  { id: 'expenses', label: 'Расходы' },
] as const

type TabId = (typeof TABS)[number]['id']

const IMPORT_TITLES: Record<string, string> = {
  revenue: 'Импорт доходов',
  expenses: 'Импорт расходов',
}

export default function FinanceScreen({ revenues, expenses, sites }: Awaited<ReturnType<typeof getFinancePage>>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const revalidator = useRevalidator()
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const activeTab = (searchParams.get('tab') ?? 'revenue') as TabId
  const [importTarget, setImportTarget] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddHosting, setShowAddHosting] = useState(false)

  const hostingFetcher = useFetcher<ActionResult>()
  useActionToast(hostingFetcher, { created: 'Хостинг добавлен', updated: 'Сумма хостинга обновлена' })

  const revenueFetcher = useFetcher<ActionResult>()
  useActionToast(revenueFetcher, { created: 'Доход добавлен', updated: 'Сумма дохода обновлена' })

  // Old behavior parity: remove revenue is client-local only
  const [removedIds, setRemovedIds] = useState<ReadonlySet<number>>(new Set())

  const period = usePeriodFilter(activeTab === 'expenses' ? expenses : revenues)

  // Category filter — expenses only
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const expenseCategories = useMemo(
    () => [...new Set(expenses.map(e => e.type))].sort(),
    [expenses],
  )

  const importConfig: CsvImportConfig | null = importTarget
    ? {
      title: IMPORT_TITLES[importTarget],
      onImportFile: file => importFile(importTarget, file),
      onImportUrl: url => importUrl(importTarget, url),
      onSuccess: () => revalidator.revalidate(),
    }
    : null

  const revenueEntries = revenues.filter(e => period.matches(e) && !removedIds.has(e.id))
  const expenseEntries = expenses.filter(
    e => period.matches(e) && (selectedCategory === null || e.type === selectedCategory),
  )

  return (
    <Container size="xl" px={0}>
      <Tabs
        value={activeTab}
        onChange={value => setSearchParams({ tab: value ?? 'revenue' })}
        keepMounted={false}
      >
        <Tabs.List mb="md">
          {TABS.map(tab => (
            <Tabs.Tab key={tab.id} value={tab.id}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="revenue">
          <RevenueTabView
            period={period}
            entries={revenueEntries}
            sites={sites}
            isAdmin={isAdmin}
            showModal={showAddModal}
            submitting={revenueFetcher.state !== 'idle'}
            onImportClick={() => setImportTarget('revenue')}
            onAddClick={() => setShowAddModal(true)}
            onRemove={id => setRemovedIds(prev => new Set(prev).add(id))}
            onModalClose={() => setShowAddModal(false)}
            onModalSubmit={values => {
              revenueFetcher.submit(
                { intent: 'add-revenue', ...values },
                { method: 'post' },
              )
              setShowAddModal(false)
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel value="expenses">
          <ExpensesTabView
            period={period}
            entries={expenseEntries}
            sites={sites}
            isAdmin={isAdmin}
            categories={expenseCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onImportClick={() => setImportTarget('expenses')}
            onAddClick={() => setShowAddHosting(true)}
          />
        </Tabs.Panel>
      </Tabs>

      {importConfig && (
        <CsvImportModal config={importConfig} onClose={() => setImportTarget(null)} />
      )}

      {isAdmin && showAddHosting && (
        <AddHostingModal
          sites={sites}
          submitting={hostingFetcher.state !== 'idle'}
          onClose={() => setShowAddHosting(false)}
          onSubmit={values => {
            hostingFetcher.submit(
              { intent: 'add-hosting', ...values },
              { method: 'post' },
            )
            setShowAddHosting(false)
          }}
        />
      )}
    </Container>
  )
}

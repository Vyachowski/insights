import { Container, Tabs } from '@mantine/core'
import CsvImportModal from '@ui/CsvImportModal'
import { useCallback, useMemo, useState } from 'react'
import { useFetcher, useSearchParams } from 'react-router'

import AddHostingModal from './AddHostingModal'
import ExpensesTabView from './ExpensesTabView'
import RevenueTabView from './RevenueTabView'
import { type EntryResult, useEntryToast } from './useEntryToast'

import type { getFinancePage } from '@/server/services/finance'

import { useAuth } from '@/hooks/useAuth'
import { useCsvImport } from '@/hooks/useCsvImport'
import { usePeriodFilter, usePeriodRows } from '@/hooks/usePeriodFilter'

const TABS = [
  { id: 'revenue', label: 'Доходы' },
  { id: 'expenses', label: 'Расходы' },
] as const

type TabId = (typeof TABS)[number]['id']

const IMPORT_TITLES = {
  revenue: 'Импорт доходов',
  expenses: 'Импорт расходов',
}

export default function FinanceScreen({ revenues, expenses, sites }: Awaited<ReturnType<typeof getFinancePage>>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const activeTab = (searchParams.get('tab') ?? 'revenue') as TabId
  const csvImport = useCsvImport(IMPORT_TITLES)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddHosting, setShowAddHosting] = useState(false)

  const hostingFetcher = useFetcher<EntryResult>()
  useEntryToast(hostingFetcher, { created: 'Хостинг добавлен', updated: 'Сумма хостинга обновлена' })

  const revenueFetcher = useFetcher<EntryResult>()
  useEntryToast(revenueFetcher, { created: 'Доход добавлен', updated: 'Сумма дохода обновлена' })

  // Old behavior parity: remove revenue is client-local only
  const [removedIds, setRemovedIds] = useState<ReadonlySet<number>>(new Set())

  const period = usePeriodFilter(activeTab === 'expenses' ? expenses : revenues)

  // Category filter — expenses only
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const expenseCategories = useMemo(
    () => [...new Set(expenses.map(e => e.type))].sort(),
    [expenses],
  )

  const isShownRevenue = useCallback((e: { id: number }) => !removedIds.has(e.id), [removedIds])
  const revenueEntries = usePeriodRows(revenues, period, isShownRevenue)

  const isShownExpense = useCallback(
    (e: { type: string }) => selectedCategory === null || e.type === selectedCategory,
    [selectedCategory],
  )
  const expenseEntries = usePeriodRows(expenses, period, isShownExpense)

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
            onImportClick={() => csvImport.open('revenue')}
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
            onImportClick={() => csvImport.open('expenses')}
            onAddClick={() => setShowAddHosting(true)}
          />
        </Tabs.Panel>
      </Tabs>

      {csvImport.config && (
        <CsvImportModal config={csvImport.config} onClose={csvImport.close} />
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

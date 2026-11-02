import { Container, Tabs } from '@mantine/core'
import { useState } from 'react'
import { useFetcher, useSearchParams } from 'react-router'

import AddHostingModal from './AddHostingModal'
import DeleteRevenueModal from './DeleteRevenueModal'
import ExpensesTabView from './ExpensesTabView'
import RevenueTabView from './RevenueTabView'
import { type DeleteResult, type EntryResult, useDeleteToast, useEntryToast } from './useEntryToast'

import type { Revenue } from '@/server/db/queries/revenues'
import type { getFinancePage } from '@/server/services/finance'

import CsvImportModal from '@/components/CsvImportModal'
import { useAuth } from '@/hooks/useAuth'
import { useCategoryFilter } from '@/hooks/useCategoryFilter'
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

export default function FinanceScreen({ revenues, expenses, sites, hostings }: Awaited<ReturnType<typeof getFinancePage>>) {
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

  const deleteFetcher = useFetcher<DeleteResult>()
  useDeleteToast(deleteFetcher)
  const [revenueToDelete, setRevenueToDelete] = useState<Revenue | null>(null)

  const period = usePeriodFilter(activeTab === 'expenses' ? expenses : revenues)

  const category = useCategoryFilter(expenses)

  const revenueEntries = usePeriodRows(revenues, period)
  const expenseEntries = usePeriodRows(expenses, period, category.matches)

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
            onRemove={setRevenueToDelete}
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
            categories={category.categories}
            selectedCategory={category.selected}
            onCategoryChange={category.setSelected}
            onImportClick={() => csvImport.open('expenses')}
            onAddClick={() => setShowAddHosting(true)}
          />
        </Tabs.Panel>
      </Tabs>

      {csvImport.config && (
        <CsvImportModal config={csvImport.config} onClose={csvImport.close} />
      )}

      {isAdmin && revenueToDelete && (
        <DeleteRevenueModal
          entry={revenueToDelete}
          sites={sites}
          onClose={() => setRevenueToDelete(null)}
          onConfirm={() => {
            deleteFetcher.submit(
              { intent: 'delete-revenue', id: revenueToDelete.id },
              { method: 'post' },
            )
            setRevenueToDelete(null)
          }}
        />
      )}

      {isAdmin && showAddHosting && (
        <AddHostingModal
          hostings={hostings}
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

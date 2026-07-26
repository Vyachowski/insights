import { Container, Tabs } from '@mantine/core'
import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { useMemo, useState } from 'react'
import { useRevalidator, useSearchParams } from 'react-router'

import type { Route } from './+types/finance'
import type { ExpenseDto, RevenueDto } from '@/lib/types'

import { useAuth } from '@/hooks/useAuth'
import { usePeriodFilter } from '@/hooks/usePeriodFilter'
import { importFile, importUrl } from '@/lib/importClient'
import ExpensesTabView from '@/modules/data/ExpensesTabView'
import RevenueTabView from '@/modules/data/RevenueTabView'
import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { expenses, revenues, sites } from '@/server/schema'

const TABS = [
  { id: 'revenue', label: 'Доходы' },
  { id: 'expenses', label: 'Расходы' },
] as const

type TabId = (typeof TABS)[number]['id']

const IMPORT_TITLES: Record<string, string> = {
  revenue: 'Импорт доходов',
  expenses: 'Импорт расходов',
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)

  const tab = new URL(request.url).searchParams.get('tab') ?? 'revenue'

  const [entries, allSites] = await Promise.all([
    fetchEntries(tab),
    db.select().from(sites).orderBy(sites.id),
  ])

  return { tab, entries, sites: allSites }
}

async function fetchEntries(tab: string) {
  switch (tab) {
    case 'expenses':
      // Stored as integer kopecks; views receive rubles
      return (await db.select().from(expenses).orderBy(expenses.id)).map(e => ({
        ...e,
        amount: e.amount / 100,
      }))
    case 'revenue':
    default:
      return (await db.select().from(revenues).orderBy(revenues.id)).map(r => ({
        ...r,
        amount: r.amount / 100,
      }))
  }
}

export default function FinancePage({ loaderData: data }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const revalidator = useRevalidator()
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const activeTab = (searchParams.get('tab') ?? 'revenue') as TabId
  const [importTarget, setImportTarget] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Old behavior parity: add/remove revenue were client-local only
  const [localAdds, setLocalAdds] = useState<RevenueDto[]>([])
  const [removedIds, setRemovedIds] = useState<ReadonlySet<number>>(new Set())

  const period = usePeriodFilter(data.entries as { date: string | Date }[])

  // Category filter — expenses only (`type` exists only on expenses)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const expenseCategories = useMemo(
    () =>
      activeTab === 'expenses'
        ? [...new Set((data.entries as unknown as ExpenseDto[]).map(e => e.type))].sort()
        : [],
    [data.entries, activeTab],
  )

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

  const revenueEntries = (
    activeTab === 'revenue'
      ? [
        ...(period.filtered as unknown as RevenueDto[]).filter(e => !removedIds.has(e.id)),
        ...localAdds,
      ]
      : []
  ) as RevenueDto[]

  const expenseEntries = (
    activeTab === 'expenses'
      ? (period.filtered as unknown as ExpenseDto[]).filter(
        e => selectedCategory === null || e.type === selectedCategory,
      )
      : []
  ) as ExpenseDto[]

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
            {...commonProps}
            entries={revenueEntries}
            sites={data.sites}
            isAdmin={isAdmin}
            showModal={showAddModal}
            onImportClick={() => setImportTarget('revenue')}
            onAddClick={() => setShowAddModal(true)}
            onRemove={id => setRemovedIds(prev => new Set(prev).add(id))}
            onModalClose={() => setShowAddModal(false)}
            onModalAdd={entry => {
              const tempId = -(Date.now() * 1000 + Math.floor(Math.random() * 1000))
              setLocalAdds(prev => [...prev, { ...entry, id: tempId }])
            }}
          />
        </Tabs.Panel>
        <Tabs.Panel value="expenses">
          <ExpensesTabView
            {...commonProps}
            entries={expenseEntries as never}
            sites={data.sites}
            categories={expenseCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onImportClick={() => setImportTarget('expenses')}
          />
        </Tabs.Panel>
      </Tabs>

      {importConfig && (
        <CsvImportModal config={importConfig} onClose={() => setImportTarget(null)} />
      )}
    </Container>
  )
}

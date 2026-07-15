import { Container, Tabs } from '@mantine/core'
import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { useMemo, useState } from 'react'
import { useRevalidator, useSearchParams } from 'react-router'

import type { Route } from './+types/data'
import type { ExpenseDto, RevenueDto } from '@/lib/types'

import { useAuth } from '@/hooks/useAuth'
import { importFile, importUrl } from '@/lib/importClient'
import CallsTabView from '@/modules/data/CallsTabView'
import CitiesTabView from '@/modules/data/CitiesTabView'
import ExpensesTabView from '@/modules/data/ExpensesTabView'
import MetricsTabView from '@/modules/data/MetricsTabView'
import RevenueTabView from '@/modules/data/RevenueTabView'
import SitesTabView from '@/modules/data/SitesTabView'
import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { callImports, cities, expenses, revenues, siteMetrics, sites } from '@/server/schema'

const TABS = [
  { id: 'revenue', label: 'Доходы' },
  { id: 'expenses', label: 'Расходы' },
  { id: 'calls', label: 'Звонки' },
  { id: 'metrics', label: 'Метрики' },
  { id: 'cities', label: 'Города' },
  { id: 'sites', label: 'Сайты' },
] as const

type TabId = (typeof TABS)[number]['id']

const IMPORT_TITLES: Record<string, string> = {
  revenue: 'Импорт доходов',
  expenses: 'Импорт расходов',
  calls: 'Импорт звонков',
  metrics: 'Импорт метрик',
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)

  const tab = new URL(request.url).searchParams.get('tab') ?? 'revenue'

  const [entries, allSites, allCities] = await Promise.all([
    fetchEntries(tab),
    db.select().from(sites).orderBy(sites.id),
    db.select().from(cities).orderBy(cities.id),
  ])

  return { tab, entries, sites: allSites, cities: allCities }
}

async function fetchEntries(tab: string) {
  switch (tab) {
    case 'revenue':
      // Stored as integer kopecks; views receive rubles
      return (await db.select().from(revenues).orderBy(revenues.id)).map(r => ({
        ...r,
        amount: r.amount / 100,
      }))
    case 'expenses':
      return (await db.select().from(expenses).orderBy(expenses.id)).map(e => ({
        ...e,
        amount: e.amount / 100,
      }))
    case 'calls':
      return db.select().from(callImports).orderBy(callImports.id)
    case 'metrics':
      return db.select().from(siteMetrics).orderBy(siteMetrics.id)
    default:
      return []
  }
}

function usePeriodFilter<T extends { date: string | Date }>(entries: T[]) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  const availableYears = useMemo(
    () =>
      [...new Set(entries.map(e => new Date(e.date).getFullYear()))].sort(
        (a, b) => b - a,
      ),
    [entries],
  )
  const effectiveYear = selectedYear ?? availableYears[0] ?? null

  const availableMonths = useMemo(
    () =>
      effectiveYear === null
        ? []
        : [
          ...new Set(
            entries
              .filter(e => new Date(e.date).getFullYear() === effectiveYear)
              .map(e => new Date(e.date).getMonth()),
          ),
        ].sort((a, b) => a - b),
    [entries, effectiveYear],
  )
  // Drop a stale month when it isn't present in the newly selected year
  const effectiveMonth
    = selectedMonth !== null && availableMonths.includes(selectedMonth)
      ? selectedMonth
      : null

  const filtered = useMemo(
    () =>
      effectiveYear === null
        ? []
        : entries.filter(e => {
          const d = new Date(e.date)
          if (d.getFullYear() !== effectiveYear) return false
          return effectiveMonth === null || d.getMonth() === effectiveMonth
        }),
    [entries, effectiveYear, effectiveMonth],
  )

  return {
    availableYears,
    effectiveYear,
    setSelectedYear,
    availableMonths,
    effectiveMonth,
    setSelectedMonth,
    filtered,
  }
}

export default function DataPage({ loaderData: data }: Route.ComponentProps) {
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
        <Tabs.Panel value="cities">
          <CitiesTabView cities={data.cities} />
        </Tabs.Panel>
        <Tabs.Panel value="sites">
          <SitesTabView sites={data.sites} cities={data.cities} />
        </Tabs.Panel>
      </Tabs>

      {importConfig && (
        <CsvImportModal config={importConfig} onClose={() => setImportTarget(null)} />
      )}
    </Container>
  )
}

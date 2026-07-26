import { Container, Tabs } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { useEffect, useMemo, useState } from 'react'
import { useFetcher, useRevalidator, useSearchParams } from 'react-router'

import type { Route } from './+types/finance'
import type { ExpenseDto, RevenueDto } from '@/lib/types'

import { useAuth } from '@/hooks/useAuth'
import { usePeriodFilter } from '@/hooks/usePeriodFilter'
import { importFile, importUrl } from '@/lib/importClient'
import AddHostingModal from '@/modules/data/AddHostingModal'
import ExpensesTabView from '@/modules/data/ExpensesTabView'
import RevenueTabView from '@/modules/data/RevenueTabView'
import { requireAdmin, requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { HOSTING_TYPE, upsertExpense } from '@/server/expenses/upsert'
import { upsertRevenue } from '@/server/revenues/upsert'
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

// Shape check plus a round-trip so calendar-invalid dates like 2024-02-30 or
// 2024-13-01 are rejected regardless of the engine's date-parsing leniency.
function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request)

  const form = await request.formData()
  const intent = String(form.get('intent') ?? '')

  const siteIdRaw = String(form.get('siteId') ?? '')
  const siteId = siteIdRaw ? Number(siteIdRaw) : null
  const amountRubles = Number(form.get('amount'))

  if (!Number.isFinite(amountRubles) || amountRubles <= 0) {
    return Response.json({ error: 'Укажите сумму больше нуля' }, { status: 400 })
  }
  if (siteId !== null && !Number.isInteger(siteId)) {
    return Response.json({ error: 'Некорректный сайт' }, { status: 400 })
  }

  if (intent === 'add-hosting') {
    const year = Number(form.get('year'))
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return Response.json({ error: 'Укажите год' }, { status: 400 })
    }
    const outcome = await upsertExpense({
      date: `${year}-01-01`,
      siteId,
      type: HOSTING_TYPE,
      amount: Math.round(amountRubles * 100), // integer kopecks
    })
    return Response.json({ ok: true, outcome })
  }

  if (intent === 'add-revenue') {
    const date = String(form.get('date') ?? '')
    if (!isValidIsoDate(date)) {
      return Response.json({ error: 'Укажите дату' }, { status: 400 })
    }
    const outcome = await upsertRevenue({
      date,
      siteId,
      amount: Math.round(amountRubles * 100), // integer kopecks
    })
    return Response.json({ ok: true, outcome })
  }

  return Response.json({ error: 'Неизвестное действие' }, { status: 400 })
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
  const [showAddHosting, setShowAddHosting] = useState(false)

  // Hosting is added via the route action; the fetcher persists it and we
  // revalidate + toast on the result.
  const hostingFetcher = useFetcher<{ ok?: boolean, outcome?: string, error?: string }>()
  useEffect(() => {
    if (hostingFetcher.state !== 'idle' || !hostingFetcher.data) return
    const { ok, outcome, error } = hostingFetcher.data
    if (ok) {
      revalidator.revalidate()
      notifications.show({
        color: outcome === 'created' ? 'teal' : outcome === 'updated' ? 'blue' : 'gray',
        message: outcome === 'created'
          ? 'Хостинг добавлен'
          : outcome === 'updated'
            ? 'Сумма хостинга обновлена'
            : 'Запись уже актуальна',
      })
    } else if (error) {
      notifications.show({ color: 'red', message: error })
    }
  }, [hostingFetcher.state, hostingFetcher.data, revalidator])

  // Revenue is added via the route action; the fetcher persists it and we
  // revalidate + toast on the result.
  const revenueFetcher = useFetcher<{ ok?: boolean, outcome?: string, error?: string }>()
  useEffect(() => {
    if (revenueFetcher.state !== 'idle' || !revenueFetcher.data) return
    const { ok, outcome, error } = revenueFetcher.data
    if (ok) {
      revalidator.revalidate()
      notifications.show({
        color: outcome === 'created' ? 'teal' : outcome === 'updated' ? 'blue' : 'gray',
        message: outcome === 'created'
          ? 'Доход добавлен'
          : outcome === 'updated'
            ? 'Сумма дохода обновлена'
            : 'Запись уже актуальна',
      })
    } else if (error) {
      notifications.show({ color: 'red', message: error })
    }
  }, [revenueFetcher.state, revenueFetcher.data, revalidator])

  // Old behavior parity: remove revenue is client-local only
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
      ? (period.filtered as unknown as RevenueDto[]).filter(e => !removedIds.has(e.id))
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
            {...commonProps}
            entries={expenseEntries as never}
            sites={data.sites}
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
          sites={data.sites}
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

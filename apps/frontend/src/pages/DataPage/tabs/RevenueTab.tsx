import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import type { Revenue, Site } from '@insights/contracts'

import { sitesApi } from '@/api/sites'
import { useAuth } from '@/hooks/useAuth'
import { openImportModal } from '@/store/slices/appSlice'
import { addRevenue, removeRevenue } from '@/store/slices/revenueSlice'
import { selectImportTick } from '@/store/selectors/appSelectors'
import { selectRevenueByYear, selectRevenueError, selectRevenueLoading, selectRevenueYears } from '@/store/selectors/revenueSelectors'
import { fetchRevenue } from '@/store/thunks/revenueThunks'
import type { AppDispatch } from '@/store'
import Button from '@ui/Button'
import Card from '@ui/Card'
import YearSelect from '@ui/YearSelect'
import AddRevenueModal from '../components/AddRevenueModal'

const PAGE_SIZE = 20

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getSiteName(siteId: number | null, sites: Site[]) {
  if (siteId === null) return null
  const site = sites.find(s => s.id === siteId)
  if (!site) return `Сайт #${siteId}`
  try { return new URL(site.url).hostname } catch { return site.url }
}

export default function RevenueTab() {
  const dispatch = useDispatch<AppDispatch>()
  const importTick = useSelector(selectImportTick('revenue'))
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const loading = useSelector(selectRevenueLoading)
  const error = useSelector(selectRevenueError)
  const availableYears = useSelector(selectRevenueYears)

  const [sites, setSites] = useState<Site[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    sitesApi.fetchAll().then(setSites).catch(() => {})
  }, [])

  useEffect(() => { dispatch(fetchRevenue()) }, [importTick])

  useEffect(() => {
    if (availableYears.length > 0) setSelectedYear(prev => prev ?? availableYears[0])
  }, [availableYears])

  const entries = useSelector(
    useMemo(() => selectedYear !== null ? selectRevenueByYear(selectedYear) : () => [], [selectedYear]),
  )

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries],
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const pageEntries = sorted.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)
  const total = entries.reduce((sum, e) => sum + e.amount, 0)

  function handleAdd(entry: Omit<Revenue, 'id'>) {
    const tempId = -(Date.now() * 1000 + Math.floor(Math.random() * 1000))
    dispatch(addRevenue({ ...entry, id: tempId }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-white font-semibold text-lg">Доходы</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? 'Загрузка...' : `${entries.length} записей · итого ${formatAmount(total)}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {availableYears.length > 0 && selectedYear && (
            <YearSelect value={selectedYear} onChange={setSelectedYear} years={availableYears} />
          )}
          <Button size="sm" variant="secondary" onClick={() => dispatch(openImportModal('revenue'))}>
            <Upload size={15} />
            Импорт CSV
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Добавить
            </Button>
          )}
        </div>
      </div>

      <Card size="sm" className="p-0 overflow-hidden">
        {error ? (
          <div className="py-16 text-center text-red-400 text-sm">{error.message}</div>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-auto max-h-[480px]">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700/50">
                  <tr>
                    <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">Дата</th>
                    <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Сайт</th>
                    <th className="text-right px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">Сумма</th>
                    <th className="px-6 py-3.5 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-800 rounded" /></td>
                        <td className="px-6 py-4 text-right"><div className="h-4 w-20 bg-slate-800 rounded ml-auto" /></td>
                        <td className="px-6 py-4" />
                      </tr>
                    ))
                  ) : pageEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-slate-500 text-sm">Нет записей за {selectedYear} год</td>
                    </tr>
                  ) : (
                    pageEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-slate-300 text-sm whitespace-nowrap">{formatDate(entry.date)}</td>
                        <td className="px-6 py-4 text-sm">
                          {entry.siteId === null
                            ? <span className="text-slate-500 italic">Общий</span>
                            : <span className="text-slate-300">{getSiteName(entry.siteId, sites)}</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-emerald-400 font-semibold tabular-nums">{formatAmount(entry.amount)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isAdmin && (
                            <button
                              onClick={() => dispatch(removeRevenue(entry.id))}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">
                  {(clampedPage - 1) * PAGE_SIZE + 1}–{Math.min(clampedPage * PAGE_SIZE, sorted.length)} из {sorted.length}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={clampedPage === 1} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - clampedPage) <= 1)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                      acc.push(p); return acc
                    }, [])
                    .map((p, i) => p === '...'
                      ? <span key={`e${i}`} className="px-2 text-slate-600 text-sm">…</span>
                      : <button key={p} onClick={() => setPage(p as number)} className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${clampedPage === p ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>{p}</button>
                    )}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={clampedPage === totalPages} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {isAdmin && showModal && (
        <AddRevenueModal onClose={() => setShowModal(false)} onAdd={handleAdd} sites={sites} />
      )}
    </div>
  )
}

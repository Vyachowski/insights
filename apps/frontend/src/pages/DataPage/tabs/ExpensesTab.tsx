import Button from '@ui/Button'
import Card from '@ui/Card'
import YearSelect from '@ui/YearSelect'
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch } from '@/store'
import type { Site } from '@insights/contracts'

import { sitesApi } from '@/api/sites'
import { selectImportTick } from '@/store/selectors/appSelectors'
import { selectExpensesError, selectExpensesLoading, selectExpenseYears } from '@/store/selectors/expensesSelectors'
import { selectExpensesByYear } from '@/store/selectors/expensesSelectors'
import { openImportModal } from '@/store/slices/appSlice'
import { fetchExpenses } from '@/store/thunks/expensesThunks'

const PAGE_SIZE = 20

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getHostname(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

export default function ExpensesTab() {
  const dispatch = useDispatch<AppDispatch>()
  const importTick = useSelector(selectImportTick('expenses'))
  const loading = useSelector(selectExpensesLoading)
  const error = useSelector(selectExpensesError)
  const availableYears = useSelector(selectExpenseYears)

  const [sites, setSites] = useState<Site[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const effectiveYear = selectedYear ?? availableYears[0] ?? null

  useEffect(() => {
    sitesApi.fetchAll().then(setSites).catch(() => {})
  }, [])

  useEffect(() => { dispatch(fetchExpenses()) }, [importTick, dispatch])

  const entries = useSelector(
    useMemo(() => effectiveYear !== null ? selectExpensesByYear(effectiveYear) : () => [], [effectiveYear]),
  )

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries],
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const pageEntries = sorted.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)
  const total = entries.reduce((sum, e) => sum + e.amount, 0)

  function getSiteName(siteId: number | null) {
    if (siteId === null) return null
    const site = sites.find(s => s.id === siteId)
    if (!site) return `Сайт #${siteId}`
    return getHostname(site.url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-white font-semibold text-lg">Расходы</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? 'Загрузка...' : `${entries.length} записей · итого ${formatAmount(total)}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {availableYears.length > 0 && effectiveYear && (
            <YearSelect value={effectiveYear} onChange={setSelectedYear} years={availableYears} />
          )}
          <Button size="sm" variant="secondary" onClick={() => dispatch(openImportModal('expenses'))}>
            <Upload size={15} />
            Импорт CSV
          </Button>
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
                    <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Тип</th>
                    <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Сайт</th>
                    <th className="text-right px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">Сумма</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-800 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-800 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : pageEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-slate-500 text-sm">Нет записей за {effectiveYear} год</td>
                    </tr>
                  ) : (
                    pageEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-slate-300 text-sm whitespace-nowrap">{formatDate(entry.date)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300">{entry.type}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {entry.siteId === null
                            ? <span className="text-slate-500 italic">Общий</span>
                            : <span className="text-slate-300">{getSiteName(entry.siteId)}</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-red-400 font-semibold tabular-nums">{formatAmount(entry.amount)}</span>
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
                      : <button key={p} onClick={() => setPage(p as number)} className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${clampedPage === p ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>{p}</button>,
                    )}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={clampedPage === totalPages} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

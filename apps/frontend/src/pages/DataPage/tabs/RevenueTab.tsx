import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'

import type { Revenue, Site } from '@insights/contracts'

import { revenueApi } from '@/api/revenue'
import { sitesApi } from '@/api/sites'
import Button from '@ui/Button'
import Card from '@ui/Card'
import AddRevenueModal from '../components/AddRevenueModal'

const PAGE_SIZE = 20

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getSiteName(siteId: number | null, sites: Site[]) {
  if (siteId === null) return null
  const site = sites.find(s => s.id === siteId)
  return site?.name ?? site?.url ?? `Сайт #${siteId}`
}

function getYearRange(year: number) {
  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  }
}

export default function RevenueTab() {
  const currentYear = new Date().getFullYear()
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear]

  const [entries, setEntries] = useState<Revenue[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  // Sites are year-independent — fetch once on mount
  useEffect(() => {
    sitesApi.findAll().then(setSites).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setPage(1)

    const { startDate, endDate } = getYearRange(selectedYear)

    revenueApi.findAll(startDate, endDate)
      .then(revenue => {
        if (cancelled) return
        setEntries(revenue)
      })
      .catch(e => {
        if (cancelled) return
        setError(e?.message ?? 'Ошибка загрузки')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [selectedYear])

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries],
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const pageEntries = sorted.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)
  const total = entries.reduce((sum, e) => sum + e.amount, 0)

  function handleDelete(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  function handleAdd(entry: Omit<Revenue, 'id'>) {
    const tempId = -(Date.now() * 1000 + Math.floor(Math.random() * 1000))
    setEntries(prev => [{ ...entry, id: tempId }, ...prev])
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
          <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
            {yearOptions.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedYear === year
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Добавить
          </Button>
        </div>
      </div>

      <Card size="sm" className="p-0 overflow-hidden">
        {error ? (
          <div className="py-16 text-center text-red-400 text-sm">{error}</div>
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
                      <td colSpan={4} className="py-16 text-center text-slate-500 text-sm">
                        Нет записей за {selectedYear} год
                      </td>
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
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
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
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={clampedPage === 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - clampedPage) <= 1)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) =>
                      p === '...'
                        ? <span key={`ellipsis-${i}`} className="px-2 text-slate-600 text-sm">…</span>
                        : (
                          <button
                            key={p}
                            onClick={() => setPage(p as number)}
                            className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                              clampedPage === p
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            {p}
                          </button>
                        ),
                    )
                  }
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={clampedPage === totalPages}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {showModal && (
        <AddRevenueModal onClose={() => setShowModal(false)} onAdd={handleAdd} sites={sites} />
      )}
    </div>
  )
}

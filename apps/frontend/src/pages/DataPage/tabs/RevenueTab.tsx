import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import Button from '@ui/Button'
import Card from '@ui/Card'
import AddRevenueModal from '../components/AddRevenueModal'
import { mockRevenue, mockSites, type RevenueEntry } from '../mock/data'

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getSiteName(siteId: number | null) {
  if (siteId === null) return 'Общий (компания)'
  return mockSites.find(s => s.id === siteId)?.name ?? `Сайт #${siteId}`
}

let nextId = mockRevenue.length + 1

export default function RevenueTab() {
  const [entries, setEntries] = useState<RevenueEntry[]>(mockRevenue)
  const [showModal, setShowModal] = useState(false)

  function handleAdd(entry: Omit<RevenueEntry, 'id'>) {
    setEntries(prev => [{ ...entry, id: nextId++ }, ...prev])
  }

  function handleDelete(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const total = entries.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">Доходы</h2>
          <p className="text-slate-500 text-sm mt-0.5">{entries.length} записей · итого {formatAmount(total)}</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Добавить
        </Button>
      </div>

      <Card size="md" className="p-0 overflow-hidden">
        {entries.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            Нет записей. Добавьте первый доход.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Дата</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Сайт</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Сумма</th>
                <th className="px-6 py-4 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {entries.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-300 text-sm whitespace-nowrap">{formatDate(entry.date)}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {entry.siteId === null
                      ? <span className="text-slate-500 italic">Общий</span>
                      : getSiteName(entry.siteId)
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
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showModal && (
        <AddRevenueModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  )
}

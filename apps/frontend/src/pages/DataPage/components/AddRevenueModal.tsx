import { useState } from 'react'
import { X } from 'lucide-react'

import type { Revenue, Site } from '@insights/contracts'

import Button from '@ui/Button'
import Input from '@ui/Input'

interface AddRevenueModalProps {
  sites: Site[]
  onClose: () => void
  onAdd: (entry: Omit<Revenue, 'id'>) => void
}

export default function AddRevenueModal({ sites, onClose, onAdd }: AddRevenueModalProps) {
  const [date, setDate] = useState('')
  const [siteId, setSiteId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!date) e.date = 'Укажите дату'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Укажите сумму'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onAdd({
      date,
      siteId: siteId ? Number(siteId) : null,
      amount: Number(amount),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-white font-semibold text-lg">Добавить доход</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Дата"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            error={errors.date}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Сайт</label>
            <select
              value={siteId}
              onChange={e => setSiteId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Общий (компания)</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {new URL(site.url).hostname}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Сумма (₽)"
            type="number"
            placeholder="0"
            min="0"
            step="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            error={errors.amount}
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" className="flex-1">
              Добавить
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

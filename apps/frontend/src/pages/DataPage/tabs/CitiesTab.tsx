import Button from '@ui/Button'
import Card from '@ui/Card'
import { MapPin, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { City } from '@insights/contracts'

import { citiesApi } from '@/api/cities'

function formatPopulation(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

export default function CitiesTab() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    citiesApi.fetchAll()
      .then(setCities)
      .catch(e => setError(e?.message ?? 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">Города</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? 'Загрузка...' : `${cities.length} городов`}
          </p>
        </div>
        <Button size="sm" disabled title="Добавление городов пока недоступно">
          <Plus size={16} />
          Добавить
        </Button>
      </div>

      <Card size="sm" className="p-0 overflow-hidden">
        {error ? (
          <div className="py-16 text-center text-red-400 text-sm">{error}</div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700/50">
              <tr>
                <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Город</th>
                <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Код</th>
                <th className="text-right px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Население</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-800 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-800 rounded" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 w-20 bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : cities.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-slate-500 text-sm">Нет данных</td>
                </tr>
              ) : (
                cities.map(city => (
                  <tr key={city.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-500 shrink-0" />
                        <span className="text-slate-200 font-medium">{city.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono px-2 py-1 rounded-md bg-slate-800 text-slate-400">{city.code}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400 tabular-nums text-sm">
                      {formatPopulation(city.population)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

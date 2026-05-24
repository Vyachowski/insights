import Button from '@ui/Button'
import Card from '@ui/Card'
import { Globe, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { City, Site } from '@insights/contracts'

import { citiesApi } from '@/api/cities'
import { sitesApi } from '@/api/sites'

function getHostname(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

export default function SitesTab() {
  const [sites, setSites] = useState<Site[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([sitesApi.fetchAll(), citiesApi.fetchAll()])
      .then(([siteList, cityList]) => { setSites(siteList); setCities(cityList) })
      .catch(e => setError(e?.message ?? 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  function getCityName(cityId: number) {
    return cities.find(c => c.id === cityId)?.name ?? `Город #${cityId}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">Сайты</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? 'Загрузка...' : `${sites.length} сайтов`}
          </p>
        </div>
        <Button size="sm" disabled title="Добавление сайтов пока недоступно">
          <Plus size={16} />
          Добавить
        </Button>
      </div>

      <Card size="sm" className="p-0 overflow-hidden">
        {error ? (
          <div className="py-16 text-center text-red-400 text-sm">{error}</div>
        ) : (
          <div className="overflow-auto max-h-[480px]">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700/50">
                <tr>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Сайт</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Город</th>
                  <th className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Группа</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-48 bg-slate-800 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-800 rounded" /></td>
                    </tr>
                  ))
                ) : sites.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-16 text-center text-slate-500 text-sm">Нет данных</td>
                  </tr>
                ) : (
                  sites.map(site => (
                    <tr key={site.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-slate-500 shrink-0" />
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-200 hover:text-emerald-400 transition-colors text-sm"
                          >
                            {getHostname(site.url)}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{getCityName(site.cityId)}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{site.group ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

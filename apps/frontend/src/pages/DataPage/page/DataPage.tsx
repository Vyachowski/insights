import { useState } from 'react'
import { BarChart3 } from 'lucide-react'

import { cn } from '@/lib/utils'
import CallsTab from '../tabs/CallsTab'
import CitiesTab from '../tabs/CitiesTab'
import ExpensesTab from '../tabs/ExpensesTab'
import PlaceholderTab from '../tabs/PlaceholderTab'
import RevenueTab from '../tabs/RevenueTab'
import SitesTab from '../tabs/SitesTab'

const tabs = [
  { id: 'revenue', label: 'Доходы' },
  { id: 'expenses', label: 'Расходы' },
  { id: 'calls', label: 'Звонки' },
  { id: 'metrics', label: 'Метрики' },
  { id: 'cities', label: 'Города' },
  { id: 'sites', label: 'Сайты' },
] as const

type TabId = typeof tabs[number]['id']

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<TabId>('revenue')

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-white font-bold text-2xl">Данные</h1>
        <p className="text-slate-500 text-sm mt-1">Управление доходами, расходами, звонками и метриками</p>
      </div>

      <div className="flex flex-wrap gap-1 p-1 bg-slate-800/50 rounded-xl w-fit border border-slate-700/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'revenue' && <RevenueTab />}
        {activeTab === 'expenses' && <ExpensesTab />}
        {activeTab === 'calls' && <CallsTab />}
        {activeTab === 'metrics' && (
          <PlaceholderTab
            title="SEO-метрики"
            description="Импорт метрик Яндекс.Метрики и Google Analytics по сайтам"
            icon={BarChart3}
          />
        )}
        {activeTab === 'cities' && <CitiesTab />}
        {activeTab === 'sites' && <SitesTab />}
      </div>
    </div>
  )
}

import { useState } from 'react'

import { cn } from '@/lib/utils'
import CallsTab from '../tabs/CallsTab'
import CitiesTab from '../tabs/CitiesTab'
import ExpensesTab from '../tabs/ExpensesTab'
import MetricsTab from '../tabs/MetricsTab'
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
        {activeTab === 'metrics' && <MetricsTab />}
        {activeTab === 'cities' && <CitiesTab />}
        {activeTab === 'sites' && <SitesTab />}
      </div>
    </div>
  )
}

import { User } from 'lucide-react'

import Logo from './Logo'

import type { menuItems } from '../navigation'

export default function Sidebar({ tabs, activeTabId, setActiveTabId }: { tabs: typeof menuItems, activeTabId: string, setActiveTabId: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col">
      <Logo />

      <nav className="flex-1 p-4 space-y-1">
        {tabs.map(item => {
          const Icon = item.icon
          const isActive = activeTabId === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTabId(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              Иван Петров
            </p>
            <p className="text-slate-500 text-xs">Администратор</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

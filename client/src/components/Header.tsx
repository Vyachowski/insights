import { User, LogOut } from 'lucide-react'

import { menuItems } from '../navigation'

export default function Header({ activeTabId }: { activeTabId: string }) {
  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {menuItems.find(item => item.id === activeTabId)?.label}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
            <User size={20} className="text-white" />
          </div>

          {/* Logout Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 transition-all duration-300">
            <LogOut size={18} />
            <span className="font-medium">Выход</span>
          </button>
        </div>
      </div>
    </header>
  )
}

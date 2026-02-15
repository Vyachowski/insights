import { X } from 'lucide-react'
import { NavLink } from 'react-router'

import Avatar from './Avatar'
import { menuItems } from '../navigation'

interface SidebarProps {
  onClose: () => void
  isSidebarOpen: boolean
}

export default function Sidebar({
  onClose,
  isSidebarOpen,
}: SidebarProps) {
  return (
    <div
      className={`
              fixed lg:static inset-y-0 left-0 z-50
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
    >
      <aside className="w-64 h-full bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <span className="text-white text-xl font-bold">I</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Insights</h2>
              <p className="text-slate-500 text-xs">Бизнес аналитика</p>
            </div>
          </div>

          {/* Close button - только на мобильных */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Закрыть меню"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.id}
                to={item.id}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon size={20} strokeWidth={2} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
            <Avatar size={8}/>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                Иван Петров
              </p>
              <p className="text-slate-500 text-xs">Администратор</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

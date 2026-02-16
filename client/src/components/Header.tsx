import { LogOut, Menu } from 'lucide-react'

import { menuItems } from '../navigation'

import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  activeTabId: string
  onMenuClick: () => void
  isSidebarOpen: boolean
}

export default function Header({
  activeTabId,
  onMenuClick,
  isSidebarOpen,
}: HeaderProps) {
  const { logout, isLoading } = useAuth()
  const activeMenuItem = menuItems.find(item => item.id === activeTabId)

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-4 md:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          {/* Burger button: mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label={isSidebarOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <Menu size={24} />
          </button>

          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-white truncate">
              {activeMenuItem?.label}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-0.5 md:mt-1 truncate">
              {new Date().toLocaleDateString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <button onClick={logout} disabled={isLoading} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 transition-all duration-300 cursor-pointer">
          <LogOut size={18} />
          <span className="font-medium hidden sm:inline">{isLoading ? 'Выходим...' : 'Выход'}</span>
        </button>
      </div>
    </header>
  )
}

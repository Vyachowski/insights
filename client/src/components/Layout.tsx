import {
  DollarSign,
  BarChart3,
  LayoutDashboard,
  Users,
  Settings,
  User,
  LogOut,
} from 'lucide-react'
import React from 'react'
import { useState, type ReactNode } from 'react'

const menuItems = [
  { id: 'financial-health', label: 'Финансовое здоровье', icon: DollarSign },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  { id: 'dashboard', label: 'Обзор', icon: LayoutDashboard },
  { id: 'team', label: 'Команда', icon: Users },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

export default function Layout({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('financial-health')

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <DollarSign className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Insights</h2>
              <p className="text-slate-500 text-xs">Аналитика</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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

        {/* User Section (bottom) */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {menuItems.find(item => item.id === activeTab)?.label}
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

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'financial-health' ? (
            children
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                  {React.createElement(
                    menuItems.find(item => item.id === activeTab)?.icon ||
                      DollarSign,
                    {
                      size: 48,
                      className: 'text-slate-600',
                    },
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-300 mb-2">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500">Раздел в разработке</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

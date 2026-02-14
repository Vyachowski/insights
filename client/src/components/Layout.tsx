import {
  DollarSign,
} from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router'

import Header from './Header'
import Sidebar from './Sidebar'
import  { menuItems } from '../navigation'

export default function Layout() {
  const [activeTabId, setActiveTabId] = useState<string>(menuItems[0].id)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      <Sidebar tabs={menuItems} activeTabId={activeTabId} setActiveTabId={setActiveTabId}/>

      <div className="flex-1 flex flex-col">
        <Header activeTabId={activeTabId} />

        <main className="flex-1 overflow-y-auto p-8">
          {activeTabId === menuItems[0].id ? (
            <Outlet />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                  {React.createElement(
                    menuItems.find(item => item.id === activeTabId)?.icon ||
                      DollarSign,
                    {
                      size: 48,
                      className: 'text-slate-600',
                    },
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-300 mb-2">
                  {menuItems.find(item => item.id === activeTabId)?.label}
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

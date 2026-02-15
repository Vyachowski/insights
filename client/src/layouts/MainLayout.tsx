import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { menuItems } from '../navigation'

export default function MainLayout() {
  const { pathname } = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  const activePageId = pathname.split('/').at(1) || menuItems[0].id

  return (
    <div className="h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Backdrop для мобильных - только когда sidebar открыт */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar
        onClose={closeSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeTabId={activePageId}
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet context={activePageId} />
        </main>
      </div>
    </div>
  )
}

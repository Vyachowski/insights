import { useState } from 'react'
import { Outlet } from 'react-router'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { menuItems } from '../navigation'

export default function MainLayout() {
  const [activeTabId, setActiveTabId] = useState<string>(menuItems[0].id)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Backdrop для мобильных - только когда sidebar открыт */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar
        tabs={menuItems}
        activeTabId={activeTabId}
        setActiveTabId={id => {
          setActiveTabId(id)
          closeSidebar()
        }}
        onClose={closeSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTabId={activeTabId}
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet context={[activeTabId, (id: string) => { setActiveTabId(id); closeSidebar()}]} />
        </main>
      </div>
    </div>
  )
}

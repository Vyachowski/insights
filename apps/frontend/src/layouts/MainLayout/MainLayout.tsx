import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Header from '@ui/Header'
import { Outlet, useLocation } from 'react-router'

import ModalManager from '@/components/ModalManager'
import Sidebar from '@/layouts/MainLayout/_components/Sidebar'
import { menuItems } from '@/navigation'

export default function MainLayout() {
  const { pathname } = useLocation()
  const [opened, { toggle, close }] = useDisclosure(false)

  const activePageId = pathname.split('/').at(1) || menuItems[0].id

  return (
    <AppShell
      header={{ height: 72 }}
      navbar={{ width: 260, breakpoint: 'lg', collapsed: { mobile: !opened } }}
      padding="lg"
    >
      <AppShell.Header>
        <Header
          activeTabId={activePageId}
          onMenuClick={toggle}
          isSidebarOpen={opened}
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar onClose={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet context={activePageId} />
      </AppShell.Main>

      <ModalManager />
    </AppShell>
  )
}

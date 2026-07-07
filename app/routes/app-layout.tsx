import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Header from '@ui/Header'
import Sidebar from '@ui/Sidebar'
import { Outlet, useLocation } from 'react-router'

import type { Route } from './+types/app-layout'

import { menuItems } from '@/navigation'
import { requireUser } from '@/server/auth'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request)
  return { user }
}

export default function AppLayout() {
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
    </AppShell>
  )
}

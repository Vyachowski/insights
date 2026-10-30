import { Alert, AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Header from '@ui/Header'
import Sidebar from '@ui/Sidebar'
import { Outlet, useLoaderData, useLocation } from 'react-router'

import type { Route } from './+types/app-layout'

import { menuItems } from '@/navigation'
import { requireUser } from '@/server/auth'
import { isBackupOverdue } from '@/server/backup'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request)
  return { user, backupOverdue: user.role === 'ADMIN' && isBackupOverdue() }
}

export default function AppLayout() {
  const { backupOverdue } = useLoaderData<typeof loader>()
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
        {backupOverdue && (
          <Alert color="red" mb="md" title="Бэкапы не работают">
            Больше суток не удаётся сохранить копию базы. Причина в логах сервиса, строки [backup].
          </Alert>
        )}
        <Outlet context={activePageId} />
      </AppShell.Main>
    </AppShell>
  )
}

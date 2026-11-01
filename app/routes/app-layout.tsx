import { Alert, AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Header from '@ui/Header'
import Sidebar from '@ui/Sidebar'
import { Outlet, useLoaderData, useLocation } from 'react-router'

import type { Route } from './+types/app-layout'

import { menuItems } from '@/menu-items'
import { requireUser } from '@/routes/helpers/auth'
import { isBackupOverdue } from '@/server/jobs/backup'
import { checkWebhookSilent } from '@/server/services/gudok-calls'
import { checkReconciliationStale } from '@/server/services/reconciliation'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request)
  const isAdmin = user.role === 'ADMIN'
  return {
    user,
    backupOverdue: isAdmin && isBackupOverdue(),
    reconciliationStale: isAdmin && await checkReconciliationStale(),
    webhookSilent: isAdmin && await checkWebhookSilent(),
  }
}

export default function AppLayout() {
  const { backupOverdue, reconciliationStale, webhookSilent } = useLoaderData<typeof loader>()
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
        {reconciliationStale && (
          <Alert color="red" mb="md" title="Сверка с Гудком устарела">
            Последняя сверка старше 90 дней, расходы держатся на оценках. Запустите букмарклет на странице истории Гудка.
          </Alert>
        )}
        {webhookSilent && (
          <Alert color="red" mb="md" title="Вебхук Гудка молчит">
            Больше суток не приходят звонки, новые могут теряться. Проверьте настройку вебхука в Гудке и логи сервиса.
          </Alert>
        )}
        <Outlet context={activePageId} />
      </AppShell.Main>
    </AppShell>
  )
}

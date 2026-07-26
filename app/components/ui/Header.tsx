import { Box, Burger, Button, Group, Text, Title } from '@mantine/core'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'

import { useAuth } from '@/hooks/useAuth'
import { menuItems } from '@/navigation'

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
  const navigate = useNavigate()
  const { logout, isLoading } = useAuth()

  const activeMenuItem = menuItems.find(item => item.id === activeTabId)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Group
      component="header"
      justify="space-between"
      gap="md"
      px="lg"
      py="md"
      h="100%"
      wrap="nowrap"
    >
      <Group gap="md" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
        <Burger
          opened={isSidebarOpen}
          onClick={onMenuClick}
          hiddenFrom="lg"
          size="sm"
          aria-label={isSidebarOpen ? 'Закрыть меню' : 'Открыть меню'}
        />

        <Box style={{ minWidth: 0 }}>
          <Title order={3} lineClamp={1}>{activeMenuItem?.label}</Title>
          {activeMenuItem?.description && (
            <Text c="dimmed" size="sm" lineClamp={1}>
              {activeMenuItem.description}
            </Text>
          )}
        </Box>
      </Group>

      <Group gap="sm" wrap="nowrap">
        <Text c="dimmed" size="sm" visibleFrom="md">
          {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
        <Button
          variant="default"
          color="red"
          onClick={handleLogout}
          loading={isLoading}
          leftSection={<LogOut size={18} />}
        >
          {isLoading ? 'Выходим...' : 'Выход'}
        </Button>
      </Group>
    </Group>
  )
}

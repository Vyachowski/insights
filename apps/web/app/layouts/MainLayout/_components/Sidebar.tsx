import { ActionIcon, Box, Group, NavLink, Stack, Text } from '@mantine/core'
import Avatar from '@ui/Avatar'
import Logo from '@ui/Logo'
import { X } from 'lucide-react'
import { NavLink as RouterNavLink } from 'react-router'

import { useAuth } from '@/hooks/useAuth'
import { menuItems } from '@/navigation'

interface SidebarProps {
  onClose: () => void
}

const borderColor = '1px solid var(--mantine-color-default-border)'

export default function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuth()

  return (
    <Stack h="100%" gap={0}>
      <Group justify="space-between" p="md" style={{ borderBottom: borderColor }}>
        <Group gap="sm">
          <Logo size={10} textSize="xl" />
          <Box>
            <Text fw={700} size="lg">Insights</Text>
            <Text c="dimmed" size="xs">Бизнес аналитика</Text>
          </Box>
        </Group>

        <ActionIcon
          hiddenFrom="lg"
          variant="subtle"
          color="gray"
          onClick={onClose}
          aria-label="Закрыть меню"
        >
          <X size={20} />
        </ActionIcon>
      </Group>

      <Stack gap={4} p="sm" style={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map(item => {
          const Icon = item.icon

          return (
            <RouterNavLink
              key={item.id}
              to={item.id}
              onClick={onClose}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <NavLink
                  component="div"
                  active={isActive}
                  label={item.label}
                  leftSection={<Icon size={20} />}
                />
              )}
            </RouterNavLink>
          )
        })}
      </Stack>

      <Box p="sm" style={{ borderTop: borderColor }}>
        <Group gap="sm" p="sm">
          <Avatar />
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" fw={500} truncate="end">
              {`${user?.firstName} ${user?.lastName}`}
            </Text>
            <Text c="dimmed" size="xs">
              {user?.isAdmin ? 'Администратор' : 'Пользователь'}
            </Text>
          </Box>
        </Group>
      </Box>
    </Stack>
  )
}

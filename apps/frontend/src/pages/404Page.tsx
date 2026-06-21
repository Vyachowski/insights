import { Center, Stack, Text, ThemeIcon } from '@mantine/core'
import { DollarSign } from 'lucide-react'
import { useOutletContext } from 'react-router'

import { menuItems } from '@/navigation'

export default function ErrorPage() {
  const activePageId = useOutletContext<string>()
  const activeItem = menuItems.find(item => item.id === activePageId)
  const Icon = activeItem?.icon ?? DollarSign

  return (
    <Center h="100%">
      <Stack align="center" gap="xs">
        <ThemeIcon size={96} radius="lg" variant="light" color="gray">
          <Icon size={48} />
        </ThemeIcon>
        <Text fz={24} fw={700} c="dimmed">{activeItem?.label}</Text>
        <Text c="dimmed">Раздел в разработке</Text>
      </Stack>
    </Center>
  )
}

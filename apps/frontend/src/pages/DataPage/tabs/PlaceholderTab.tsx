import { Badge, Card, Center, Stack, Text, ThemeIcon } from '@mantine/core'

import type { LucideIcon } from 'lucide-react'

interface PlaceholderTabProps {
  title: string
  description: string
  icon: LucideIcon
}

export default function PlaceholderTab({ title, description, icon: Icon }: PlaceholderTabProps) {
  return (
    <Card withBorder radius="md" p="lg">
      <Center py={80}>
        <Stack align="center" gap="xs">
          <ThemeIcon size={56} radius="lg" variant="light" color="gray">
            <Icon size={24} />
          </ThemeIcon>
          <Text fw={600} size="lg">{title}</Text>
          <Text c="dimmed" size="sm" ta="center" maw={320}>{description}</Text>
          <Badge variant="light" color="gray" mt="sm">Скоро</Badge>
        </Stack>
      </Center>
    </Card>
  )
}

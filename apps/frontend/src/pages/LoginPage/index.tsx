import { Stack, Text, Title } from '@mantine/core'
import Card from '@ui/Card'
import Logo from '@ui/Logo'

import LoginForm from './components/LoginForm'

export default function LoginPage() {
  return (
    <Stack gap="xl">
      <Stack align="center" gap="xs">
        <Logo />
        <Title order={2} mt="md">Добро пожаловать</Title>
        <Text c="dimmed">Войдите в систему для доступа к аналитике</Text>
      </Stack>

      <Card size="lg">
        <LoginForm />
      </Card>
    </Stack>
  )
}

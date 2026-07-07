import { Alert, Box, Center, Stack, Text, Title } from '@mantine/core'
import Button from '@ui/Button'
import Card from '@ui/Card'
import Input from '@ui/Input'
import Logo from '@ui/Logo'
import { data, Form, redirect, useNavigation } from 'react-router'

import type { Route } from './+types/login'

import { createUserSession, getUser, verifyLogin } from '@/server/auth'

export async function loader({ request }: Route.LoaderArgs) {
  if (await getUser(request)) throw redirect('/')
  return null
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const email = String(form.get('email') ?? '')
  const password = String(form.get('password') ?? '')

  const user = await verifyLogin(email, password)
  if (!user) {
    return data({ error: 'Неверный email или пароль' }, { status: 400 })
  }
  return createUserSession(user.id, '/')
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation()
  const isSubmitting = navigation.state !== 'idle'

  return (
    <Center mih="100vh" p="md">
      <Box w="100%" maw={420}>
        <Stack gap="xl">
          <Stack align="center" gap="xs">
            <Logo />
            <Title order={2} mt="md">Добро пожаловать</Title>
            <Text c="dimmed">Войдите в систему для доступа к аналитике</Text>
          </Stack>

          <Card size="lg">
            <Form method="post">
              <Stack gap="lg">
                {actionData?.error && (
                  <Alert color="red" variant="light">
                    {actionData.error}
                  </Alert>
                )}

                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="example@company.com"
                  autoComplete="email"
                  autoFocus
                  required
                />

                <Input
                  type="password"
                  name="password"
                  label="Пароль"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />

                <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                  Войти
                </Button>
              </Stack>
            </Form>
          </Card>
        </Stack>
      </Box>
    </Center>
  )
}

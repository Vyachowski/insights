import { Alert, Box, Center, Stack, Text, Title } from '@mantine/core'
import { Form, useNavigation } from 'react-router'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Logo from '@/components/Logo'

export default function LoginScreen({ error }: { error?: string }) {
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
                {error && (
                  <Alert color="red" variant="light">
                    {error}
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

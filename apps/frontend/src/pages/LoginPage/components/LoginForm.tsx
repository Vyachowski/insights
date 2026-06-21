import { Alert, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import Button from '@ui/Button'
import Input from '@ui/Input'
import { useNavigate } from 'react-router'

import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuth()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Введите корректный email'),
      password: value => (value.length > 0 ? null : 'Введите пароль'),
    },
  })

  const handleSubmit = form.onSubmit(async values => {
    clearError()

    const success = await login(values)

    if (success) navigate('/')
  })

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        {error && (
          <Alert color="red" variant="light">
            {error.message}
          </Alert>
        )}

        <Input
          type="email"
          label="Email"
          placeholder="example@company.com"
          autoComplete="email"
          autoFocus
          key={form.key('email')}
          {...form.getInputProps('email')}
        />

        <Input
          type="password"
          label="Пароль"
          placeholder="••••••••"
          autoComplete="current-password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Войти
        </Button>
      </Stack>
    </form>
  )
}

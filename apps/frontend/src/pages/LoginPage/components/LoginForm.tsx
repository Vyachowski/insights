import { Alert, Stack } from '@mantine/core'
import Button from '@ui/Button'
import Input from '@ui/Input'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()

    const success = await login({ email, password })

    if (success) navigate('/')
  }

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
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          autoFocus
        />

        <Input
          type="password"
          label="Пароль"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
          {error.message}
        </div>
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
        className="w-full cursor-pointer"
        isLoading={isLoading}
      >
        Войти
      </Button>
    </form>
  )
}

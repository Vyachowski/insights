import { useState } from 'react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()

    try {
      await login({ email, password })
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
          {error}
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

import { useState } from 'react'

import Button from '@/components/Button'
import Input from '@/components/Input'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    // TODO: Заменить на реальный API запрос
    // eslint-disable-next-line no-console
    console.log('Login attempt:', { email, password })

    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false)
      // TODO: обработка ответа, редирект и т.д.
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        className="w-full"
        isLoading={isLoading}
      >
        Войти
      </Button>
    </form>
  )
}

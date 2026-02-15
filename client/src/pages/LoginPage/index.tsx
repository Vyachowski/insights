import LoginForm from './_components/LoginForm'

import Card from '@/components/Card'

export default function LoginPage() {
  return (
    <div className="space-y-8">
      {/* Логотип и заголовок */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 mb-4">
          <span className="text-white text-3xl font-bold">I</span>
        </div>
        <h1 className="text-3xl font-bold text-white">
          Добро пожаловать
        </h1>
        <p className="text-slate-400">
          Войдите в систему для доступа к аналитике
        </p>
      </div>

      {/* Форма входа */}
      <Card size="lg">
        <LoginForm />
      </Card>

      {/* Дополнительные ссылки (опционально) */}
      <div className="text-center">
        <button className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
          Забыли пароль?
        </button>
      </div>
    </div>
  )
}

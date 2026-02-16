import LoginForm from './_components/LoginForm'

import Card from '@/components/Card'
import Logo from '@/components/Logo'

export default function LoginPage() {
  return (
    <div className="space-y-8">

      <div className="text-center space-y-3">
        <Logo className='mx-auto mb-4'/>
        <h1 className="text-3xl font-bold text-white">
          Добро пожаловать
        </h1>
        <p className="text-slate-400">
          Войдите в систему для доступа к аналитике
        </p>
      </div>

      <Card size="lg">
        <LoginForm />
      </Card>

      {/* <div className="text-center">
        <button className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
          Забыли пароль?
        </button>
      </div> */}
    </div>
  )
}

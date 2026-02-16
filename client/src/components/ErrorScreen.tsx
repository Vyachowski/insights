import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import Button from './Button'

interface ErrorScreenProps {
  error: string
}

export default function ErrorScreen({ error }: ErrorScreenProps) {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)
  const [errorSent, setErrorSent] = useState(false)

  useEffect(() => {
    // TODO: Отправка ошибки администратору
    const sendErrorReport = async () => {
      try {
        console.error(error)
        setErrorSent(true)
      } catch (err) {
        console.error('Failed to send error report:', err)
      }
    }

    sendErrorReport()
  }, [error])

  useEffect(() => {
    if (countdown === 0) {
      navigate('/', { replace: true })
      return
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, navigate])

  const handleReloadNow = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Фоновые blur круги (красноватые для ошибки) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Контент */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="backdrop-blur-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-2xl rounded-2xl p-8 space-y-6">

          {/* Иконка ошибки */}
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Заголовок */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Критическая ошибка
            </h1>
            <p className="text-slate-400">
              Приложение не может продолжить работу
            </p>
          </div>

          {/* Детали ошибки */}
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm font-mono text-red-300 break-all">
              {error}
            </p>
          </div>

          {/* Статус отправки */}
          {errorSent && (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Отчет об ошибке отправлен администратору</span>
            </div>
          )}

          {/* Таймер */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border-4 border-emerald-500/30">
              <span className="text-2xl font-bold text-emerald-400">
                {countdown}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Автоматическая перезагрузка через {countdown} сек.
            </p>
          </div>

          {/* Кнопки действий */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={handleReloadNow}
            >
              Перезагрузить сейчас
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

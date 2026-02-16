import Logo from './Logo'

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Фоновые blur круги */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <Logo size={20} className="shadow-lg shadow-emerald-500/30 animate-pulse" textSize='4xl'/>

        {/* Спиннер */}
        <div className="relative">
          <svg
            className="animate-spin h-12 w-12 text-emerald-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        {/* Текст */}
        <p className="text-slate-400 text-lg animate-pulse">
          Загрузка приложения...
        </p>
      </div>
    </div>
  )
}

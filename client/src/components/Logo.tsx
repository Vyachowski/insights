import { DollarSign } from 'lucide-react'

export default function Logo() {
  return (
    <div className="p-6 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <DollarSign className="text-white" size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Insights</h2>
          <p className="text-slate-500 text-xs">Бизнес аналитика</p>
        </div>
      </div>
    </div>
  )
}

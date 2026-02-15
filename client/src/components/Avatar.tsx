import { User } from 'lucide-react'

export default function Avatar({ size = 10 }: { size?: number }) {
  return (
    <div className={`w-${size} h-${size} rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/20 transition-all`}>
      <User size={size * 2} className="text-white" />
    </div>
  )
}

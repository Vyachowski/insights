import Card from '@ui/Card'

import type { LucideIcon } from 'lucide-react'

interface PlaceholderTabProps {
  title: string
  description: string
  icon: LucideIcon
}

export default function PlaceholderTab({ title, description, icon: Icon }: PlaceholderTabProps) {
  return (
    <Card size="md" className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-500" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs">{description}</p>
      <span className="mt-4 text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-500">Скоро</span>
    </Card>
  )
}

import { DollarSign } from 'lucide-react'
import React from 'react'
import { useOutletContext } from 'react-router'

import { menuItems } from '../navigation'

export default function ErrorPage() {
  const activePageId = useOutletContext<string>()

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-slate-800/50 flex items-center justify-center">
          {React.createElement(
            menuItems.find(item => item.id === activePageId)?.icon ||
                      DollarSign,
            {
              size: 48,
              className: 'text-slate-600',
            },
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-300 mb-2">
          {menuItems.find(item => item.id === activePageId)?.label}
        </h2>
        <p className="text-slate-500">Раздел в разработке</p>
      </div>
    </div>
  )
}

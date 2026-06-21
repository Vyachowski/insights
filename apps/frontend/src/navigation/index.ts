import { LayoutDashboard, Upload } from 'lucide-react'

export const menuItems = [
  { id: 'dashboard', label: 'Финансы', description: 'Доходы, расходы и ключевые метрики по сайтам', icon: LayoutDashboard },
  { id: 'data', label: 'Данные', description: 'Управление доходами, расходами, звонками и метриками', icon: Upload },
] as const

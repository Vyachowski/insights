import { LayoutDashboard, Upload } from 'lucide-react'

export const menuItems = [
  { id: 'dashboard', label: 'Сводка', description: 'Растём или падаем, тренд или разовое, кто из городов лидирует', icon: LayoutDashboard },
  { id: 'data', label: 'Данные', description: 'Управление доходами, расходами, звонками и метриками', icon: Upload },
] as const

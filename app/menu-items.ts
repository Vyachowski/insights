import { Building2, LayoutDashboard, Phone, Wallet } from 'lucide-react'

export const menuItems = [
  { id: 'dashboard', label: 'Сводка', description: 'Ключевые показатели и тренды', icon: LayoutDashboard },
  { id: 'finance', label: 'Финансы', description: 'Доходы и расходы', icon: Wallet },
  { id: 'traffic', label: 'Трафик', description: 'Звонки и SEO-метрики сайтов', icon: Phone },
  { id: 'branches', label: 'Филиалы', description: 'Города и сайты', icon: Building2 },
] as const

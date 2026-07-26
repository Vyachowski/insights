import { Building2, LayoutDashboard, Phone, Wallet } from 'lucide-react'

export const menuItems = [
  { id: 'dashboard', label: 'Сводка', description: 'Растём или падаем, тренд или разовое, кто из городов лидирует', icon: LayoutDashboard },
  { id: 'finance', label: 'Финансы', description: 'Доходы и расходы портфеля', icon: Wallet },
  { id: 'traffic', label: 'Трафик', description: 'Звонки и SEO-метрики сайтов', icon: Phone },
  { id: 'branches', label: 'Филиалы', description: 'Города и сайты портфеля', icon: Building2 },
] as const

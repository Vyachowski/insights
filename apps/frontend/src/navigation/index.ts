import { DollarSign, BarChart3, LayoutDashboard, Users, Settings } from 'lucide-react'

export const menuItems = [
  { id: 'finances', label: 'Финансы', icon: DollarSign },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  { id: 'dashboard', label: 'Обзор', icon: LayoutDashboard },
  { id: 'team', label: 'Команда', icon: Users },
  { id: 'settings', label: 'Настройки', icon: Settings },
] as const

export const menuItemsId = menuItems.map(item => item.id)

export type MenuItems = typeof menuItems
export type MenuItemsId = typeof menuItemsId

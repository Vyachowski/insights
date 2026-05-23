import { LayoutDashboard, Upload } from 'lucide-react'

export const menuItems = [
  { id: 'dashboard', label: 'Финансы', icon: LayoutDashboard },
  { id: 'data', label: 'Данные', icon: Upload },
] as const

export const menuItemsId = menuItems.map(item => item.id)

export type MenuItems = typeof menuItems
export type MenuItemsId = typeof menuItemsId

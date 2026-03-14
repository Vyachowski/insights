
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (num: number) =>
  new Intl.NumberFormat('ru-RU').format(num)

export function formatUserRole(role: string) {
  return role === 'ADMIN' ? 'Администратор' : 'Пользователь'
}

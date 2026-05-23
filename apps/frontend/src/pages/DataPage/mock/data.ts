export const mockSites = [
  { id: 1, name: 'spb-stomatolog.ru', city: 'Санкт-Петербург' },
  { id: 2, name: 'msk-clinic.ru', city: 'Москва' },
  { id: 3, name: 'nsk-med.ru', city: 'Новосибирск' },
  { id: 4, name: 'ekb-health.ru', city: 'Екатеринбург' },
]

export interface RevenueEntry {
  id: number
  siteId: number | null
  date: string
  amount: number
}

export const mockRevenue: RevenueEntry[] = [
  { id: 1, siteId: 1, date: '2025-05-15', amount: 150000 },
  { id: 2, siteId: 2, date: '2025-05-15', amount: 220000 },
  { id: 3, siteId: null, date: '2025-05-10', amount: 50000 },
  { id: 4, siteId: 3, date: '2025-04-30', amount: 180000 },
  { id: 5, siteId: 1, date: '2025-04-30', amount: 140000 },
  { id: 6, siteId: 4, date: '2025-04-15', amount: 95000 },
  { id: 7, siteId: 2, date: '2025-03-31', amount: 210000 },
  { id: 8, siteId: null, date: '2025-03-15', amount: 45000 },
]

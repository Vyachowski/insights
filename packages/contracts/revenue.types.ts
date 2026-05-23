export interface Revenue {
  id: number
  siteId: number | null
  date: string
  amount: number
}

export interface Site {
  id: number
  cityId: number
  name: string | null
  group: string | null
  url: string
}

export interface RevenueDto {
  id: number
  siteId: number | null
  date: string | Date
  amount: number
}

export interface SiteDto {
  id: number
  cityId: number
  name: string | null
  group: string | null
  url: string
}

export interface CityDto {
  id: number
  code: string
  slug: string
  name: string
  population: number
}

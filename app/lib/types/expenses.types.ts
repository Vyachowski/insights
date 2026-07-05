export interface ExpenseDto {
  id: number
  siteId: number | null
  date: string | Date
  amount: number
  type: string
  comment: string | null
}

export interface ImportResultDto {
  created: number
  updated?: number
  skipped: number
}

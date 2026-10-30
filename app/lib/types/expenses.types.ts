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
  // Calls import only: rows left for a person to resolve
  disputed?: number
  disputedCsv?: string | null
}

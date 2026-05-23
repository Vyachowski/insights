export interface Expense {
  id: number
  siteId: number | null
  date: string
  amount: number
  type: string
  comment: string | null
}

export interface ImportResult {
  created: number
  updated?: number
  skipped: number
}

export interface CreateExpenseRequest {
  siteId?: number | null
  date: string
  amount: number
  type: string
  comment?: string | null
}

export interface ImportExpensesRequest {
  expenses: CreateExpenseRequest[]
}

export interface ImportExpensesResult {
  created: number
  skipped: number
}

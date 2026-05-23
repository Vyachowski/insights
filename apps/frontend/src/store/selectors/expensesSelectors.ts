import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '..'

export const selectExpensesData = (state: RootState) => state.expenses.data
export const selectExpensesLoading = (state: RootState) => state.expenses.isLoading
export const selectExpensesError = (state: RootState) => state.expenses.error

export const selectExpenseYears = createSelector(
  selectExpensesData,
  data => {
    const years = [...new Set(data.map(e => new Date(e.date).getFullYear()))]
    return years.sort((a, b) => b - a)
  },
)

export const selectExpensesByYear = (year: number) =>
  createSelector(
    selectExpensesData,
    data => data.filter(e => new Date(e.date).getFullYear() === year),
  )

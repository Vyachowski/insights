import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '..'

const selectRevenueData = (state: RootState) => state.revenue.data
export const selectRevenueLoading = (state: RootState) => state.revenue.isLoading
export const selectRevenueError = (state: RootState) => state.revenue.error

export const selectRevenueYears = createSelector(
  selectRevenueData,
  data => {
    const years = [...new Set(data.map(e => new Date(e.date).getFullYear()))]
    return years.sort((a, b) => b - a)
  },
)

export const selectRevenueByYear = (year: number) =>
  createSelector(
    selectRevenueData,
    data => data.filter(e => new Date(e.date).getFullYear() === year),
  )

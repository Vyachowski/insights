import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '..'

const selectCallsData = (state: RootState) => state.calls.data
export const selectCallsLoading = (state: RootState) => state.calls.isLoading
export const selectCallsError = (state: RootState) => state.calls.error

export const selectCallYears = createSelector(
  selectCallsData,
  data => {
    const years = [...new Set(data.map(e => new Date(e.date).getFullYear()))]
    return years.sort((a, b) => b - a)
  },
)

export const selectCallsByYear = (year: number) =>
  createSelector(
    selectCallsData,
    data => data.filter(e => new Date(e.date).getFullYear() === year),
  )

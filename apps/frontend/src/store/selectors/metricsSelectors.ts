import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '..'

const selectMetricsData = (state: RootState) => state.metrics.data
export const selectMetricsLoading = (state: RootState) => state.metrics.isLoading
export const selectMetricsError = (state: RootState) => state.metrics.error

export const selectMetricYears = createSelector(
  selectMetricsData,
  data => {
    const years = [...new Set(data.map(e => new Date(e.date).getFullYear()))]
    return years.sort((a, b) => b - a)
  },
)

export const selectMetricsByYear = (year: number) =>
  createSelector(
    selectMetricsData,
    data => data.filter(e => new Date(e.date).getFullYear() === year),
  )

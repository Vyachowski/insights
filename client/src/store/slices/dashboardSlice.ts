import { createSlice } from '@reduxjs/toolkit'

import { fetchDashboardSummary } from '../thunks/dashboardThunks'

export interface DashboardState {
  data: {
    lastWeekSummary: {
      weekStart: string
      weekEnd: string
      revenue: number
      expenses: number
      profit: number
    } | null
    monthlyComparison: {
      currentMonth: { month: string; profit: number }
      lastYearSameMonth: { month: string; profit: number }
      difference: number
      percentage: number
    } | null
    yearlyTrend: {
      currentYear: Array<{ week: number; profit: number }>
      lastYear: Array<{ week: number; profit: number }>
    } | null
    citiesProfit: Array<{
      year: number
      cities: Array<{ city: string; profit: number }>
    }>
    businessHealth: {
      isGrowing: boolean
      growthPercent: number
      avgCurrent: number
      avgPrevious: number
    } | null
  }
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: DashboardState = {
  data: {
    lastWeekSummary: null,
    monthlyComparison: null,
    yearlyTrend: null,
    citiesProfit: [],
    businessHealth: null,
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: state => {
      state.data = initialState.data
      state.lastUpdated = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardSummary.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to load dashboard'
      })
  },
})

export const { clearDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer

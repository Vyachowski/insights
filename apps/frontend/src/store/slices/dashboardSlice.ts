import { createSlice } from '@reduxjs/toolkit'

import { fetchDashboardSummary } from '../thunks/dashboardThunks'

import type { ResourceState } from './types'
import type { DashboardResponse } from '@contracts/dashboard.contract'

const initialState: ResourceState<Partial<DashboardResponse>> = {
  data: {},
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: state => {
      state.data = initialState.data
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
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to load dashboard'
      })
  },
})

export const { clearDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer

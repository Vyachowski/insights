import { createSlice } from '@reduxjs/toolkit'

import { fetchDashboardSummary } from '../thunks/dashboardThunks'

import type { ResourceState } from './types'
import type { DashboardDto as DashboardResponse } from '@insights/contracts'

const initialState: ResourceState<Partial<DashboardResponse>> = {
  data: {},
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
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
        state.error = action.payload ?? { code: 'UNKNOWN', message: 'Failed to load dashboard' }
      })
  },
})

export default dashboardSlice.reducer

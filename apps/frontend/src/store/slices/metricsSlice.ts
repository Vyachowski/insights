import { createSlice } from '@reduxjs/toolkit'

import { fetchMetrics } from '../thunks/metricsThunks'

import type { ResourceState } from './types'
import type { SiteMetricDto as SiteMetric } from '@insights/contracts'

const initialState: ResourceState<SiteMetric[]> = {
  data: [],
  isLoading: false,
  error: null,
}

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMetrics.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? { code: 'UNKNOWN', message: 'Failed to load metrics' }
      })
  },
})

export default metricsSlice.reducer

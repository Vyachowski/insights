import { createSlice } from '@reduxjs/toolkit'

import { fetchRevenue } from '../thunks/revenueThunks'

import type { ResourceState } from './types'
import type { RevenueDto as Revenue } from '@insights/contracts'

const initialState: ResourceState<Revenue[]> = {
  data: [],
  isLoading: false,
  error: null,
}

const revenueSlice = createSlice({
  name: 'revenue',
  initialState,
  reducers: {
    removeRevenue: (state, action: { payload: number }) => {
      state.data = state.data.filter(e => e.id !== action.payload)
    },
    addRevenue: (state, action: { payload: Revenue }) => {
      state.data.unshift(action.payload)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRevenue.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? { code: 'UNKNOWN', message: 'Failed to load revenue' }
      })
  },
})

export const { removeRevenue, addRevenue } = revenueSlice.actions
export default revenueSlice.reducer

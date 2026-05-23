import { createSlice } from '@reduxjs/toolkit'

import type { CallImport } from '@insights/contracts'

import { fetchCalls } from '../thunks/callsThunks'

import type { ResourceState } from './types'

const initialState: ResourceState<CallImport[]> = {
  data: [],
  isLoading: false,
  error: null,
}

const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCalls.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCalls.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchCalls.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? { code: 'UNKNOWN', message: 'Failed to load calls' }
      })
  },
})

export default callsSlice.reducer

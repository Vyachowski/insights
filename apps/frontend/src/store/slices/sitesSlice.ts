import { createSlice } from '@reduxjs/toolkit'

import { fetchSites } from '../thunks/sitesThunks'

import type { ResourceState } from './types'
import type { SiteDto as Site } from '@insights/contracts'

const initialState: ResourceState<Site[]> = {
  data: [],
  isLoading: true,
  error: null,
}

const sitesSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSites.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? { code: 'UNKNOWN', message: 'Failed to load sites' }
      })
  },
})

export default sitesSlice.reducer

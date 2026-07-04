import { createSlice } from '@reduxjs/toolkit'

import { fetchCities } from '../thunks/citiesThunks'

import type { ResourceState } from './types'
import type { CityDto as City } from '@insights/contracts'

const initialState: ResourceState<City[]> = {
  data: [],
  isLoading: true,
  error: null,
}

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCities.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? { code: 'UNKNOWN', message: 'Failed to load cities' }
      })
  },
})

export default citiesSlice.reducer

import { createAsyncThunk } from '@reduxjs/toolkit'

import type { ApiError, City } from '@insights/contracts'

import { citiesApi } from '@/api/cities'

export const fetchCities = createAsyncThunk<City[], void, { rejectValue: ApiError }>(
  'cities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await citiesApi.fetchAll()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

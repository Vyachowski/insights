import { createAsyncThunk } from '@reduxjs/toolkit'

import type { ApiError, Revenue } from '@insights/contracts'

import { revenueApi } from '@/api/revenue'

export const fetchRevenue = createAsyncThunk<Revenue[], void, { rejectValue: ApiError }>(
  'revenue/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await revenueApi.fetchAll()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

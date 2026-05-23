import { createAsyncThunk } from '@reduxjs/toolkit'

import type { ApiError, DashboardResponse } from '@insights/contracts'

import { dashboardApi } from '@/api/dashboard'

export const fetchDashboardSummary = createAsyncThunk<DashboardResponse, void, { rejectValue: ApiError }>(
  'finances',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApi.getDashboardSummary()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

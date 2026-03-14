import { createAsyncThunk } from '@reduxjs/toolkit'

import { dashboardApi } from '@/api/dashboard'

export const fetchDashboardSummary = createAsyncThunk(
  'finances',
  async () => {
    return await dashboardApi.getDashboardSummary()
  },
)

import { createAsyncThunk } from '@reduxjs/toolkit'

import type { ApiError, SiteMetricDto as SiteMetric } from '@insights/contracts'

import { metricsApi } from '@/api/metrics'

export const fetchMetrics = createAsyncThunk<SiteMetric[], void, { rejectValue: ApiError }>(
  'metrics/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await metricsApi.fetchAll()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

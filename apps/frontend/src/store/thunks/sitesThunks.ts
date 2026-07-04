import { createAsyncThunk } from '@reduxjs/toolkit'

import type { ApiError, SiteDto as Site } from '@insights/contracts'

import { sitesApi } from '@/api/sites'

export const fetchSites = createAsyncThunk<Site[], void, { rejectValue: ApiError }>(
  'sites/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await sitesApi.fetchAll()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

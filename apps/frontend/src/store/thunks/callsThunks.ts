import { createAsyncThunk } from '@reduxjs/toolkit'

import type { ApiError, CallImport } from '@insights/contracts'

import { callsApi } from '@/api/calls'

export const fetchCalls = createAsyncThunk<CallImport[], void, { rejectValue: ApiError }>(
  'calls/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await callsApi.findImports()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

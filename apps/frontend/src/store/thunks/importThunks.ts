import { createAsyncThunk } from '@reduxjs/toolkit'

import type { ImportModalTarget } from '@/store/slices/appSlice'
import type { ApiError, ImportResult } from '@insights/contracts'

import { callsApi } from '@/api/calls'
import { expensesApi } from '@/api/expenses'
import { metricsApi } from '@/api/metrics'
import { revenueApi } from '@/api/revenue'

const uploaders: Record<
  ImportModalTarget,
  { file: (file: File) => Promise<ImportResult>; url: (url: string) => Promise<ImportResult> }
> = {
  expenses: { file: expensesApi.uploadCsv, url: expensesApi.uploadUrl },
  revenue: { file: revenueApi.uploadCsv, url: revenueApi.uploadUrl },
  calls: { file: callsApi.uploadCsv, url: callsApi.uploadUrl },
  metrics: { file: metricsApi.uploadCsv, url: metricsApi.uploadUrl },
}

type ImportArg =
  | { target: ImportModalTarget; file: File }
  | { target: ImportModalTarget; url: string }

export const importData = createAsyncThunk<ImportResult, ImportArg, { rejectValue: ApiError }>(
  'import/upload',
  async (arg, { rejectWithValue }) => {
    try {
      return 'file' in arg
        ? await uploaders[arg.target].file(arg.file)
        : await uploaders[arg.target].url(arg.url)
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

import { createAsyncThunk } from '@reduxjs/toolkit'

import type { ApiError, Expense } from '@insights/contracts'

import { expensesApi } from '@/api/expenses'

export const fetchExpenses = createAsyncThunk<Expense[], void, { rejectValue: ApiError }>(
  'expenses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await expensesApi.findAll()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

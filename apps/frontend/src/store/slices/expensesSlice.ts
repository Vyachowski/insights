import { createSlice } from '@reduxjs/toolkit'

import { fetchExpenses } from '../thunks/expensesThunks'

import type { ResourceState } from './types'
import type { ExpenseDto as Expense } from '@insights/contracts'

const initialState: ResourceState<Expense[]> = {
  data: [],
  isLoading: false,
  error: null,
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchExpenses.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? { code: 'UNKNOWN', message: 'Failed to load expenses' }
      })
  },
})

export default expensesSlice.reducer

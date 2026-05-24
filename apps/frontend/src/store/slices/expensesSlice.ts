import { createSlice } from '@reduxjs/toolkit'

import { fetchExpenses } from '../thunks/expensesThunks'

import type { ResourceState } from './types'
import type { Expense } from '@insights/contracts'

const initialState: ResourceState<Expense[]> = {
  data: [],
  isLoading: false,
  error: null,
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    removeExpense: (state, action: { payload: number }) => {
      state.data = state.data.filter(e => e.id !== action.payload)
    },
    addExpense: (state, action: { payload: Expense }) => {
      state.data.unshift(action.payload)
    },
  },
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

export const { removeExpense, addExpense } = expensesSlice.actions
export default expensesSlice.reducer

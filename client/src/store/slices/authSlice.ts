import { createSlice } from '@reduxjs/toolkit'

import { fetchLogin, fetchLogout, fetchMe } from '../thunks'

import type { User } from '../../api/auth'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    resetAuth: state => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: builder => {
    // ============================================
    // LOGIN
    // ============================================
    builder
      .addCase(fetchLogin.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.error.message || 'Ошибка входа'
      })

    // ============================================
    // LOGOUT
    // ============================================
    builder
      .addCase(fetchLogout.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchLogout.fulfilled, state => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(fetchLogout.rejected, state => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })

    // ============================================
    // ME (проверка авторизации при загрузке)
    // ============================================
    builder
      .addCase(fetchMe.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(fetchMe.rejected, state => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, resetAuth } = authSlice.actions
export default authSlice.reducer

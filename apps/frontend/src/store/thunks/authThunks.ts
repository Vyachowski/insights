import { createAsyncThunk } from '@reduxjs/toolkit'
import type { ApiError } from '@insights/contracts'
import type { LoginRequest } from '@insights/contracts/auth.types'

import { authApi } from '../../api/auth'

export const fetchLogin = createAsyncThunk(
  'auth/login',
  async (loginRequest: LoginRequest, { rejectWithValue }) => {
    try {
      return await authApi.login(loginRequest)
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

export const fetchLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me()
    } catch (e) {
      return rejectWithValue(e as ApiError)
    }
  },
)

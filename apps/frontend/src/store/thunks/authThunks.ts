import { createAsyncThunk } from '@reduxjs/toolkit'

import { authApi } from '../../api/auth'
import type { LoginRequest } from '@insights/contracts/auth.types'

export const fetchLogin = createAsyncThunk(
  'auth/login',
  async (loginRequest: LoginRequest) => {
    return await authApi.login(loginRequest)
  },
)

export const fetchLogout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authApi.logout()
  },
)

export const fetchMe = createAsyncThunk(
  'auth/me',
  async () => {
    return await authApi.me()
  },
)

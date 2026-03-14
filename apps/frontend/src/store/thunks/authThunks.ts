import { createAsyncThunk } from '@reduxjs/toolkit'

import { authApi, type LoginRequest } from '../../api/auth'

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

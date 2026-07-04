import type { ApiSuccess } from '@insights/contracts'
import type { LoginDto as LoginRequest, UserDto as User } from '@insights/contracts/auth.types'

import axiosInstance from '@/lib/axios'
import { parseApiError } from '@/lib/parseApiError'

export const authApi = {
  login: async (data: LoginRequest): Promise<User> => {
    try {
      const { data: res } = await axiosInstance.post<ApiSuccess<User>>('/auth/login', data)
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (e) {
      throw parseApiError(e)
    }
  },

  me: async (): Promise<User> => {
    try {
      const { data: res } = await axiosInstance.get<ApiSuccess<User>>('/auth/me')
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },
}

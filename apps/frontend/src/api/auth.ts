import type { ApiSuccess } from '@insights/contracts'
import type { LoginRequest, User } from '@insights/contracts/auth.types'

import axiosInstance from '@/lib/axios'

export const authApi = {
  login: async (data: LoginRequest): Promise<User> => {
    const { data: resData } = await axiosInstance.post<ApiSuccess<User>>('/auth/login', data)
    return resData.data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
  },

  me: async (): Promise<User> => {
    const { data: resData } = await axiosInstance.get<ApiSuccess<User>>('/auth/me')
    return resData.data
  },
}

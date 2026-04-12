import type { ApiResponse } from '@insights/contracts'

import axiosInstance from '@/lib/axios'

import type { LoginRequest, User } from '@insights/contracts/auth.types'

export const authApi = {
  login: async (data: LoginRequest): Promise<User> => {
    const { data: resData } = await axiosInstance.post<ApiResponse<User>>('/auth/login', data)

    return resData.data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
  },

  me: async (): Promise<User> => {
    const { data: resData } = await axiosInstance.get<ApiResponse<User>>('/auth/me')
    return resData.data
  },
}

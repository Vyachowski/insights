import type { ApiResponse } from '@/types'

import axiosInstance from '@/lib/axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export const authApi = {
  login: async (data: LoginRequest): Promise<User> => {
    const { data: resData } = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', data)

    return resData.data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
  },

  me: async (): Promise<User> => {
    const { data: resData } = await axiosInstance.get<ApiResponse<User>>('/auth/me')
    return resData.data
  },

  // refresh: async (): Promise<void> => {
  //   await axiosInstance.post('/auth/refresh')
  // },
}

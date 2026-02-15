import axiosInstance from '@/lib/axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  data: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
  message: string
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
    const { data: resData } = await axiosInstance.post<LoginResponse>('/auth/login', data)
    return resData.data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
  },

  me: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me')
    return response.data
  },

  // refresh: async (): Promise<void> => {
  //   await axiosInstance.post('/auth/refresh')
  // },
}

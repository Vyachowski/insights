import axiosInstance from '@/lib/axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  // TODO: обнови под реальную структуру ответа сервера
  user: {
    id: string
    email: string
    name: string
  }
  // Токены не нужны если используются HTTP-only cookies
}

export interface User {
  id: string
  email: string
  name: string
  role?: string
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', data)
    return response.data
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

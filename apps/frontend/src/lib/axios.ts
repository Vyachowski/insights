import axios, { type AxiosError } from 'axios'
import type { ApiError, ApiFailure } from '@insights/contracts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  config => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  error => {
    if (import.meta.env.DEV) {
      console.error('[API Request Error]', error)
    }
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiFailure>) => {
    const apiError: ApiError = error.response?.data?.error ?? {
      code: 'NETWORK_ERROR',
      message: 'Network request failed',
    }

    if (import.meta.env.DEV) {
      console.error(`[API Error] ${apiError.code}: ${apiError.message}`)
    }

    return Promise.reject(apiError)
  },
)

export default axiosInstance

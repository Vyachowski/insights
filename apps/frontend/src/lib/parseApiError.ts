import { AxiosError } from 'axios'
import type { ApiError, ApiFailure } from '@insights/contracts'

export function parseApiError(error: unknown): ApiError {
  if (error instanceof AxiosError && error.response?.data) {
    return (error.response.data as ApiFailure).error
  }

  return { code: 'NETWORK_ERROR', message: 'Network request failed' }
}

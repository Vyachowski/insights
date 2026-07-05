export type ApiError = {
  code: string
  message: string
  details?: Record<string, string[]>
}

export type ApiSuccess<T> = {
  data: T
}

export type ApiFailure = {
  error: ApiError
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

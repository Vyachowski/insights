import type { ApiError } from '@insights/contracts'

export interface ResourceState<T> {
  data: T
  isLoading: boolean
  error: ApiError | null
}

export interface EntityState<T> {
  entities: Record<string, T>
  ids: string[]
}

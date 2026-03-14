export interface ResourceState<T> {
  data: T
  isLoading: boolean
  error: string | null
}

export interface EntityState<T> {
  entities: Record<string, T>
  ids: string[]
}

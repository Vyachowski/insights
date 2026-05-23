import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthLoaded,
} from '@/store/selectors/authSelectors'
import { clearError } from '@/store/slices/authSlice'
import { fetchLogin, fetchLogout, fetchMe } from '@/store/thunks/authThunks'
import type { LoginRequest } from '@insights/contracts'

export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectUser)
  const error = useAppSelector(selectAuthError)

  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectAuthLoading)
  const isLoaded = useAppSelector(selectAuthLoaded)

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(fetchLogin(credentials))
      return fetchLogin.fulfilled.match(result)
    },
    [dispatch],
  )

  const logout = useCallback(async () => {
    await dispatch(fetchLogout())
  }, [dispatch])

  const checkAuth = useCallback(async () => {
    await dispatch(fetchMe())
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    isLoading,
    isLoaded,
    error,
    login,
    logout,
    checkAuth,
    clearError: clearAuthError,
  }
}

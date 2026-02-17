import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import type { LoginRequest } from '@/api/auth'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '@/store/selectors/authSelectors'
import { clearError } from '@/store/slices/authSlice'
import { fetchLogin, fetchLogout, fetchMe } from '@/store/thunks/authThunks'

export function useAuth() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(fetchLogin(credentials))
      if (fetchLogin.fulfilled.match(result)) {
        navigate('/')
        return result.payload
      }
      throw result.error
    },
    [dispatch, navigate],
  )

  const logout = useCallback(async () => {
    await dispatch(fetchLogout())
    navigate('/login')
  }, [dispatch, navigate])

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
    error,
    login,
    logout,
    checkAuth,
    clearError: clearAuthError,
  }
}

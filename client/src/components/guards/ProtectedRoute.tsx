import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'

import SplashScreen from '../screens/SplashScreen'

import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, isLoaded, checkAuth } = useAuth()

  const isAuthChecking = !isLoaded || isLoading
  const isLoggedOut = !isAuthenticated && isLoaded

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth()
    }
  }, [isAuthenticated, checkAuth])

  if (isAuthChecking) return <SplashScreen />
  if (isLoggedOut) return <Navigate to="/login" replace />

  return <Outlet />
}

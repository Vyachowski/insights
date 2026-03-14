import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'

import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/store/hooks'
import { fetchMe } from '@/store/thunks/authThunks'

export default function GuestRoute() {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

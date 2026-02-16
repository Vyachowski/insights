import { Navigate, Outlet } from 'react-router'

import { useAppSelector } from '@/store/hooks'
import { selectIsAuthenticated } from '@/store/selectors/authSelectors'

export default function GuestRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

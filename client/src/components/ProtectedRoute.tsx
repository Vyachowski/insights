import { Navigate, Outlet } from 'react-router'

export default function ProtectedRoute() {
  // TODO: Заменить на реальную проверку авторизации
  const isAuthenticated = false // или useAuth(), useSelector(state => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

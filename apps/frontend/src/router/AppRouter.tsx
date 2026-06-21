import { Routes, Route, Navigate } from 'react-router'

import GuestRoute from '@/components/guards/GuestRoute'
import ProtectedRoute from '@/components/guards/ProtectedRoute'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import { menuItems } from '@/navigation'
import ErrorPage from '@/pages/404Page'
import { DashboardPageWithSkeleton } from '@/pages/DashboardPage'
import { DataPage } from '@/pages/DataPage'
import LoginPage from '@/pages/LoginPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          {/* <Route path="register" element={<Register />} /> */}
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to={menuItems[0].id} replace />} />
          <Route path={menuItems[0].id} element={<DashboardPageWithSkeleton />} />
          <Route path={menuItems[1].id} element={<DataPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

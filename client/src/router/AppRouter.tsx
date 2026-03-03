import { SkeletonTheme } from 'react-loading-skeleton'
import { Routes, Route, Navigate } from 'react-router'

import GuestRoute from '@/components/guards/GuestRoute'
import ProtectedRoute from '@/components/guards/ProtectedRoute'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import { menuItems } from '@/navigation'
import ErrorPage from '@/pages/404Page'
import { DashboardPageWithSkeleton } from '@/pages/DashboardPage'
import LoginPage from '@/pages/LoginPage'

import 'react-loading-skeleton/dist/skeleton.css'

export default function AppRouter() {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      borderRadius={16}
      duration={1.2}
    >
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
            {/* <Route path={menuItems[1].id} element={<AnalyticsPage />} />
          <Route path={menuItems[2].id} element={<DashboardPage />} />
          <Route path={menuItems[3].id} element={<TeamPage />} />
          <Route path={menuItems[4].id} element={<SettingsPage />} /> */}
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Route>
      </Routes>
    </SkeletonTheme>
  )
}

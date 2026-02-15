import { Routes, Route, Navigate } from 'react-router'

import MainLayout from '../layouts/MainLayout'
import { menuItems } from '../navigation'
import ErrorPage from '../pages/404Page'
import FinancialPage from '../pages/FinancesPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* TODO: ADD AUTH LAYER */}
      {/* <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route> */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to={menuItems[0].id} replace />} />
        <Route path={menuItems[0].id} element={<FinancialPage />} />
        {/* <Route path={menuItems[1].id} element={<AnalyticsPage />} />
        <Route path={menuItems[2].id} element={<DashboardPage />} />
        <Route path={menuItems[3].id} element={<TeamPage />} />
        <Route path={menuItems[4].id} element={<SettingsPage />} /> */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

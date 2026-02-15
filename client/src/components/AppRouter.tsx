import { Routes, Route } from 'react-router'

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
        <Route element={<FinancialPage />} index/>
        <Route path={menuItems[0].id} element={<FinancialPage />} />
        <Route path ="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

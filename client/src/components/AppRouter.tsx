import { Routes, Route } from 'react-router'

import Dashboard from './Dashboard'
import Layout from './Layout'

export default function AppRouter() {
  return (
    <Routes>
      {/* TODO: ADD AUTH LAYER */}
      {/* <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route> */}
      <Route path="/" element={<Layout />}>
        <Route element={<Dashboard />} index/>
      </Route>
    </Routes>
  )
}

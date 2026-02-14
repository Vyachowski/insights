import { Routes, Route } from 'react-router'

import Dashboard from './Dashboard'
import Layout from './Layout'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<Dashboard />} index/>
      </Route>
    </Routes>
  )
}

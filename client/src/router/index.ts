import { lazy } from 'react'

import AppRouter from '@/router/AppRouter'

const LazyAppRouter = lazy(() => import('@/router/AppRouter'))

export {
  LazyAppRouter,
  AppRouter,
}

import { lazy } from 'react'

const LazyAppRouter = lazy(() => import('@/router/AppRouter'))

export {
  LazyAppRouter,
}

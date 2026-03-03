import { lazy, Suspense } from 'react'

import SplashScreen from './components/screens/SplashScreen'

const LazyAppRouter = lazy(() => import('@/router/AppRouter'))

export default function App() {
  return (
    <Suspense fallback={<SplashScreen/>}>
      <LazyAppRouter />
    </Suspense>
  )
}

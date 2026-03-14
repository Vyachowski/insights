import { Suspense } from 'react'

import SplashScreen from './components/screens/SplashScreen'
import { LazyAppRouter } from './router'

export default function App() {
  return (
    <Suspense fallback={<SplashScreen/>}>
      <LazyAppRouter />
    </Suspense>
  )
}

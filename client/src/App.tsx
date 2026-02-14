import { BrowserRouter } from 'react-router'

import AppRouter from './components/AppRouter'
import SplashScreen from './components/SplashScreen'
import { useAppInit } from './hooks/useAppInit'

export default function App() {
  const { isReady, error } = useAppInit()

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!isReady) {
    return <SplashScreen />
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

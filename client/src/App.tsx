import { BrowserRouter } from 'react-router'

import SplashScreen from './components/SplashScreen'
import { useAppInit } from './hooks/useAppInit'
import AppRouter from './router/AppRouter'

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

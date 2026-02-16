
import ErrorScreen from './components/ErrorScreen'
import SplashScreen from './components/SplashScreen'
import { useAppInit } from './hooks/useAppInit'
import AppRouter from './router/AppRouter'

export default function App() {
  const { isReady, error } = useAppInit()

  if (error) {
    return <ErrorScreen error={error}/>
  }

  if (!isReady) {
    return <SplashScreen />
  }

  return <AppRouter />
}

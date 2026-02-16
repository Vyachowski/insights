import { useEffect } from 'react'

export function useAppInit() {
  useEffect(() => {

  }, [])

  return { isReady: false, error: false }
}

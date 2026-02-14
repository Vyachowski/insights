import { useState, useEffect } from 'react'

// import { loadConfig } from '../services/config'

export function useAppInit() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      try {
        // await loadConfig()
        // другие проверки
        setIsReady(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Init failed')
      }
    }
    init()
  }, [])

  return { isReady, error }
}

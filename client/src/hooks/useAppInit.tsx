import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAppError, selectIsAppReady } from '@/store/selectors/appSelectors'
import { setAppError, setAppReady } from '@/store/slices/appSlice'
import { fetchMe } from '@/store/thunks/authThunks'
import { fetchDashboardSummary } from '@/store/thunks/dashboardThunks'

export function useAppInit() {
  const dispatch = useAppDispatch()

  const isReady = useAppSelector(selectIsAppReady)
  const error = useAppSelector(selectAppError)

  useEffect(() => {
    async function initApp() {
      try {
        await dispatch(fetchMe())
        await dispatch(fetchDashboardSummary())
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        dispatch(setAppError(message))

        return
      }
      dispatch(setAppReady())
    }

    initApp()
  }, [dispatch])

  return { isReady, error }
}

import { notifications } from '@mantine/notifications'
import { useEffect, useRef } from 'react'
import { useRevalidator, type useFetcher } from 'react-router'

import type { addFinanceEntry } from '@/server/services/finance'

export type EntryResult = Awaited<ReturnType<typeof addFinanceEntry>>

const OUTCOME_COLORS = { created: 'teal', updated: 'blue', skipped: 'gray' }

/**
 * Revalidates and shows one toast per settled action result. The ref guard
 * stops the effect looping when revalidate() changes the revalidator identity.
 */
export function useEntryToast(
  fetcher: ReturnType<typeof useFetcher<EntryResult>>,
  messages: { created: string, updated: string },
) {
  const revalidator = useRevalidator()
  const handled = useRef<unknown>(null)

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return
    if (handled.current === fetcher.data) return
    handled.current = fetcher.data
    const result = fetcher.data
    if ('error' in result) {
      notifications.show({ color: 'red', message: result.error })
      return
    }
    revalidator.revalidate()
    notifications.show({
      color: OUTCOME_COLORS[result.outcome],
      message: { ...messages, skipped: 'Запись уже актуальна' }[result.outcome],
    })
    // revalidator is intentionally excluded: its identity changes on revalidate,
    // which would re-run this effect and loop the toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data])
}

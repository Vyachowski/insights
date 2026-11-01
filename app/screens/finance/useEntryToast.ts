import type { addFinanceEntry } from '@/server/services/finance'
import type { useFetcher } from 'react-router'

import { useResultToast } from '@/hooks/useResultToast'

export type EntryResult = Awaited<ReturnType<typeof addFinanceEntry>>

export function useEntryToast(
  fetcher: ReturnType<typeof useFetcher<EntryResult>>,
  messages: { created: string, updated: string },
) {
  useResultToast(fetcher, {
    created: { color: 'teal', message: messages.created },
    updated: { color: 'blue', message: messages.updated },
    skipped: { color: 'gray', message: 'Запись уже актуальна' },
  })
}

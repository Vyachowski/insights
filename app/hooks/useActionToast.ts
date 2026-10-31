import { notifications } from '@mantine/notifications'
import { useEffect, useRef } from 'react'
import { useRevalidator, type useFetcher } from 'react-router'

export type ActionResult = { ok?: boolean, outcome?: string, error?: string }

/**
 * Revalidates and shows one toast per settled action result. The ref guard
 * stops the effect looping when revalidate() changes the revalidator identity.
 */
export function useActionToast(
  fetcher: ReturnType<typeof useFetcher<ActionResult>>,
  messages: { created: string, updated: string },
) {
  const revalidator = useRevalidator()
  const handled = useRef<unknown>(null)

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return
    if (handled.current === fetcher.data) return
    handled.current = fetcher.data
    const { ok, outcome, error } = fetcher.data
    if (ok) {
      revalidator.revalidate()
      notifications.show({
        color: outcome === 'created' ? 'teal' : outcome === 'updated' ? 'blue' : 'gray',
        message: outcome === 'created'
          ? messages.created
          : outcome === 'updated'
            ? messages.updated
            : 'Запись уже актуальна',
      })
    } else if (error) {
      notifications.show({ color: 'red', message: error })
    }
    // revalidator is intentionally excluded: its identity changes on revalidate,
    // which would re-run this effect and loop the toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data])
}

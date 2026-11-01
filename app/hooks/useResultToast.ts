import { notifications } from '@mantine/notifications'
import { useEffect, useRef } from 'react'
import { useRevalidator } from 'react-router'

export type ActionResult<Outcome extends string> = { error: string } | { ok: boolean, outcome: Outcome }

/**
 * Revalidates and shows one toast per settled action result. The ref guard
 * stops the effect looping when revalidate() changes the revalidator identity.
 */
export function useResultToast<Outcome extends string>(
  fetcher: { state: string, data?: ActionResult<Outcome> },
  toasts: Record<Outcome, { color: string, message: string }>,
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
    notifications.show(toasts[result.outcome])
    // revalidator is intentionally excluded: its identity changes on revalidate,
    // which would re-run this effect and loop the toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data])
}

import { notifications } from '@mantine/notifications'
import { useEffect, useRef } from 'react'
import { useRevalidator } from 'react-router'

export type ActionResult<Outcome extends string> = { error: string } | { ok: boolean, outcome: Outcome }

/**
 * Revalidates and shows one toast per settled action result. The ref guard
 * stops a repeat when revalidate() changes the revalidator identity, or a
 * caller passes new `toasts`.
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
  }, [fetcher.state, fetcher.data, revalidator, toasts])
}

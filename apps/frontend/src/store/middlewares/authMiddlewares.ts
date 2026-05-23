import { resetAuth } from '../slices/authSlice'

import type { ApiError } from '@insights/contracts'
import type { Middleware } from '@reduxjs/toolkit'

const isUnauthorizedError = (action: unknown): boolean => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'payload' in action &&
    typeof (action as { payload: unknown }).payload === 'object' &&
    (action as { payload: unknown }).payload !== null &&
    ((action as { payload: ApiError }).payload as ApiError).code === 'UNAUTHORIZED'
  )
}

export const authMiddleware: Middleware = store => next => action => {
  if (isUnauthorizedError(action)) {
    store.dispatch(resetAuth())
  }

  return next(action)
}

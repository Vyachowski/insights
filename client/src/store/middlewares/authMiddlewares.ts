import { resetAuth } from '../slices/authSlice'

import type { Middleware } from '@reduxjs/toolkit'

const isUnauthorizedError = (action: unknown) => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'payload' in action &&
    typeof action.payload === 'object' &&
    action.payload !== null &&
    'status' in action.payload &&
    (action.payload).status === 401
  )
}

// TODO: Learn middlwares and redux inner structure
export const authMiddleware: Middleware = store => next => action => {
  if (isUnauthorizedError(action)) {
    store.dispatch(resetAuth())
  }

  return next(action)
}

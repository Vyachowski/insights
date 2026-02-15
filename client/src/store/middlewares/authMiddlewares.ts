import { fetchLogout } from '../thunks'

const authMiddleware = store => next => action => {
  if (action.error?.response?.status === 401) {
    store.dispatch(fetchLogout())
  }

  return next(action)
}

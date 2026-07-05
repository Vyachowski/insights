import { useFetcher, useRouteLoaderData } from 'react-router'

import type { SessionUser } from '@/server/auth'

// Same contract the old Redux-based useAuth exposed, so Header/Sidebar
// port unchanged: user comes from the app-layout loader, logout posts
// to the /logout action.
export function useAuth() {
  const data = useRouteLoaderData<{ user: SessionUser }>('routes/app-layout')
  const fetcher = useFetcher()

  const user = data?.user
    ? { ...data.user, isAdmin: data.user.role === 'ADMIN' }
    : null

  return {
    user,
    isLoading: fetcher.state !== 'idle',
    logout: async () => {
      await fetcher.submit(null, { method: 'post', action: '/logout' })
    },
  }
}

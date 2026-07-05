import type { Route } from './+types/logout'

import { logout } from '@/server/auth'

export async function action({ request }: Route.ActionArgs) {
  return logout(request)
}

export async function loader({ request }: Route.LoaderArgs) {
  return logout(request)
}

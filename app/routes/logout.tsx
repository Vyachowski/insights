import type { Route } from './+types/logout'

import { logout } from '@/routes/helpers/auth'

export async function action({ request }: Route.ActionArgs) {
  return logout(request)
}

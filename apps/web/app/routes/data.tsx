import type { Route } from './+types/data'

import { requireAdmin } from '@/server/auth'

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request)
  return null
}

// Admin-only action stub for auth verification (task 3.3); the real
// import action lands with the data-page task group.
export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request)
  return { ok: true }
}

export default function DataPage() {
  return <p>Data — ported in the next task group.</p>
}

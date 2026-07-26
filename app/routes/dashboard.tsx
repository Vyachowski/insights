import { Container, Stack } from '@mantine/core'

import type { Route } from './+types/dashboard'

import CallsByCityWidget from '@/modules/dashboard/CallsByCityWidget'
import TrendsWidget from '@/modules/dashboard/TrendsWidget'
import VerdictWidget from '@/modules/dashboard/VerdictWidget'
import { requireUser } from '@/server/auth'
import { getDashboardSummary } from '@/server/queries/dashboard'

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request)
  return getDashboardSummary()
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { verdict, trends, callsByCity } = loaderData

  return (
    <Container size={900} px={0}>
      <Stack gap="xl">
        <VerdictWidget verdict={verdict} />
        <TrendsWidget trends={trends} />
        <CallsByCityWidget cities={callsByCity} />
      </Stack>
    </Container>
  )
}

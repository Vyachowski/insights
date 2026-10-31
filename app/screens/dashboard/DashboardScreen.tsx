import { Container, Stack } from '@mantine/core'

import CallsByCityWidget from './CallsByCityWidget'
import MonthlyProfitWidget from './MonthlyProfitWidget'
import TrendsWidget from './TrendsWidget'
import VerdictWidget from './VerdictWidget'

import type { DashboardSummary } from '@/server/core/dashboard'

export default function DashboardScreen({ verdict, trends, callsByCity, monthlyProfit }: DashboardSummary) {
  return (
    <Container size={900} px={0}>
      <Stack gap="xl">
        <VerdictWidget verdict={verdict} />
        <TrendsWidget trends={trends} />
        <MonthlyProfitWidget monthly={monthlyProfit} />
        <CallsByCityWidget cities={callsByCity} />
      </Stack>
    </Container>
  )
}

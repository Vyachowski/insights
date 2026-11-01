import { Badge, Box, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { useFetcher } from 'react-router'

import { CHARGE_TOASTS } from './charge-toasts'
import ChargeActions from './ChargeActions'
import ChargeModal from './ChargeModal'

import type { Site } from '@/server/db/queries/sites'
import type { NumberCharge, NumberChargeResult } from '@/server/services/auto-charges'

import { useResultToast } from '@/hooks/useResultToast'
import { formatAmount, formatDate, formatDayMonth, getSiteName } from '@/lib/format'

interface NumbersTabViewProps {
  numbers: NumberCharge[]
  sites: Site[]
  isAdmin: boolean
}

export default function NumbersTabView({ numbers, sites, isAdmin }: NumbersTabViewProps) {
  const [editing, setEditing] = useState<NumberCharge | null>(null)
  const fetcher = useFetcher<NumberChargeResult>()
  useResultToast(fetcher, CHARGE_TOASTS)
  const submitting = fetcher.state !== 'idle'

  const submit = (intent: string, row: NumberCharge, values: { nextDate?: string, amount?: string } = {}) => {
    const { provider, providerNumberId } = row
    fetcher.submit({ intent, provider, providerNumberId, ...values }, { method: 'post' })
  }

  return (
    <Stack gap="md">
      <Box>
        <Title order={4}>Номера</Title>
        <Text c="dimmed" size="sm">
          {`${numbers.length} номеров`}
        </Text>
      </Box>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <ScrollArea.Autosize mah={480}>
          <Table stickyHeader highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Номер</Table.Th>
                <Table.Th>Название</Table.Th>
                <Table.Th>Сайт</Table.Th>
                <Table.Th>Автосписание</Table.Th>
                <Table.Th>Следующая дата</Table.Th>
                <Table.Th ta="right">Сумма</Table.Th>
                {isAdmin && <Table.Th />}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {numbers.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={isAdmin ? 7 : 6}>
                    <Text ta="center" c="dimmed" size="sm" py={64}>Нет данных</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                numbers.map(row => (
                  <Table.Tr key={`${row.provider}:${row.providerNumberId}`}>
                    <Table.Td style={{ whiteSpace: 'nowrap' }}>{row.number ?? '—'}</Table.Td>
                    <Table.Td>{row.name ?? '—'}</Table.Td>
                    <Table.Td c="dimmed">{getSiteName(row.siteId, sites) ?? '—'}</Table.Td>
                    <Table.Td>
                      <Stack gap={4} align="flex-start">
                        <Badge variant="light" color={row.enabled ? 'teal' : 'gray'} size="sm">
                          {row.enabled ? 'Включено' : 'Выключено'}
                        </Badge>
                        {row.noChargePeriodEnd && (
                          <Badge variant="light" color="red" size="sm" miw="max-content">
                            {`Нет списания в Гудке до ${formatDayMonth(row.noChargePeriodEnd)}`}
                          </Badge>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                      {row.nextDate ? formatDate(row.nextDate) : '—'}
                    </Table.Td>
                    <Table.Td ta="right">{row.amount === null ? '—' : formatAmount(row.amount)}</Table.Td>
                    {isAdmin && (
                      <Table.Td ta="right">
                        <ChargeActions
                          enabled={row.enabled}
                          disabled={submitting}
                          canEnable={row.siteId !== null}
                          onEdit={() => setEditing(row)}
                          onSwitchOff={() => submit('switch-off', row)}
                        />
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea.Autosize>
      </Paper>

      {isAdmin && editing && (
        <ChargeModal
          row={editing}
          name={editing.name ?? editing.number ?? '—'}
          noOfferHint="По сайту нет реальных списаний: укажите дату и сумму."
          submitting={submitting}
          onClose={() => setEditing(null)}
          onSubmit={values => {
            submit('save', editing, values)
            setEditing(null)
          }}
        />
      )}
    </Stack>
  )
}

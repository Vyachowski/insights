import { Badge, Box, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { useFetcher } from 'react-router'

import { CHARGE_TOASTS } from './charge-toasts'
import ChargeActions from './ChargeActions'
import ChargeModal from './ChargeModal'

import type { HostingCharge, HostingChargeResult } from '@/server/services/auto-charges'

import { useResultToast } from '@/hooks/useResultToast'
import { formatAmount, formatDate } from '@/lib/format'

interface HostingsTabViewProps {
  hostings: HostingCharge[]
  isAdmin: boolean
}

export default function HostingsTabView({ hostings, isAdmin }: HostingsTabViewProps) {
  const [editing, setEditing] = useState<HostingCharge | null>(null)
  const fetcher = useFetcher<HostingChargeResult>()
  useResultToast(fetcher, CHARGE_TOASTS)
  const submitting = fetcher.state !== 'idle'

  const submit = (intent: string, row: HostingCharge, values: { nextDate?: string, amount?: string } = {}) => {
    fetcher.submit({ intent, hostingId: row.id, ...values }, { method: 'post' })
  }

  return (
    <Stack gap="md">
      <Box>
        <Title order={4}>Хостинг</Title>
        <Text c="dimmed" size="sm">
          {`Хостингов: ${hostings.length}`}
        </Text>
      </Box>

      <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
        <ScrollArea.Autosize mah={480}>
          <Table stickyHeader highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Провайдер</Table.Th>
                <Table.Th>Аккаунт</Table.Th>
                <Table.Th ta="right">Сайтов</Table.Th>
                <Table.Th>Автосписание</Table.Th>
                <Table.Th>Следующая дата</Table.Th>
                <Table.Th ta="right">Сумма</Table.Th>
                {isAdmin && <Table.Th />}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {hostings.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={isAdmin ? 7 : 6}>
                    <Text ta="center" c="dimmed" size="sm" py={64}>Нет данных</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                hostings.map(row => (
                  <Table.Tr key={row.id}>
                    <Table.Td>{row.provider}</Table.Td>
                    <Table.Td>{row.account}</Table.Td>
                    <Table.Td ta="right">{row.siteCount}</Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={row.enabled ? 'teal' : 'gray'} size="sm">
                        {row.enabled ? 'Включено' : 'Выключено'}
                      </Badge>
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
          name={`${editing.provider} ${editing.account}`}
          noOfferHint="По хостингу нет списаний: укажите дату и сумму."
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

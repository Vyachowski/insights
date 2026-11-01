import { Group, Modal, Stack, Text } from '@mantine/core'
import { useState } from 'react'

import type { NumberCharge } from '@/server/services/auto-charges'

import Button from '@/components/Button'
import Input from '@/components/Input'

interface NumberChargeModalProps {
  row: NumberCharge
  submitting: boolean
  onClose: () => void
  onSubmit: (values: { nextDate: string, amount: string }) => void
}

export default function NumberChargeModal({ row, submitting, onClose, onSubmit }: NumberChargeModalProps) {
  // A number that is off starts from the offer, never from its old stored values
  const start = row.enabled ? row : row.offer
  const [nextDate, setNextDate] = useState(start?.nextDate ?? '')
  const [amount, setAmount] = useState(start?.amount?.toString() ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!nextDate) e.nextDate = 'Укажите дату'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Укажите сумму больше нуля'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({ nextDate, amount })
  }

  return (
    <Modal
      opened
      onClose={onClose}
      title={`${row.enabled ? 'Автосписание' : 'Включить автосписание'}: ${row.name ?? row.number ?? '—'}`}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {!start && (
            <Text c="dimmed" size="sm">По сайту нет реальных списаний: укажите дату и сумму.</Text>
          )}

          <Input
            label="Следующая дата"
            type="date"
            value={nextDate}
            onChange={e => setNextDate(e.target.value)}
            error={errors.nextDate}
          />

          <Input
            label="Сумма (₽)"
            type="number"
            placeholder="0"
            min="0"
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            error={errors.amount}
          />

          <Group justify="flex-end" gap="sm" pt="xs">
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={submitting}>
              {row.enabled ? 'Сохранить' : 'Включить'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

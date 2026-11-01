import { Group, Modal, Select, Stack } from '@mantine/core'
import { useState } from 'react'

import type { HostingOption } from '@/server/services/finance'

import Button from '@/components/Button'
import Input from '@/components/Input'

interface HostingValues {
  hostingId: string
  date: string
  amount: string
}

interface AddHostingModalProps {
  hostings: HostingOption[]
  submitting: boolean
  onClose: () => void
  onSubmit: (values: HostingValues) => void
}

export default function AddHostingModal({ hostings, submitting, onClose, onSubmit }: AddHostingModalProps) {
  const [hostingId, setHostingId] = useState(String(hostings[0]?.id ?? ''))
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const hostingOptions = hostings.map(({ id, provider, account }) => ({
    value: String(id),
    label: `${provider} ${account}`,
  }))

  function validate() {
    const e: Record<string, string> = {}
    if (!hostingId) e.hostingId = 'Хостинг не найден'
    if (!date) e.date = 'Укажите дату'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Укажите сумму'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({ hostingId, date, amount })
  }

  // Future: this modal may host other expense types; for now only hosting.
  return (
    <Modal opened onClose={onClose} title="Добавить хостинг" centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Select
            label="Хостинг"
            value={hostingId}
            onChange={value => setHostingId(value ?? '')}
            data={hostingOptions}
            allowDeselect={false}
            error={errors.hostingId}
            comboboxProps={{ withinPortal: false }}
          />

          <Input
            label="Дата"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            error={errors.date}
          />

          <Input
            label="Сумма (₽)"
            type="number"
            placeholder="0"
            min="0"
            step="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            error={errors.amount}
          />

          <Group justify="flex-end" gap="sm" pt="xs">
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Сохранение…' : 'Добавить'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

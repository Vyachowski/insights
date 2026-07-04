import { Group, Modal, Select, Stack } from '@mantine/core'
import Button from '@ui/Button'
import Input from '@ui/Input'
import { useState } from 'react'

import type { RevenueDto as Revenue, SiteDto as Site } from '@insights/contracts'

interface AddRevenueModalProps {
  sites: Site[]
  onClose: () => void
  onAdd: (entry: Omit<Revenue, 'id'>) => void
}

function siteLabel(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

export default function AddRevenueModal({ sites, onClose, onAdd }: AddRevenueModalProps) {
  const [date, setDate] = useState('')
  const [siteId, setSiteId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const siteOptions = [
    { value: '', label: 'Общий (компания)' },
    ...sites.map(site => ({ value: String(site.id), label: siteLabel(site.url) })),
  ]

  function validate() {
    const e: Record<string, string> = {}
    if (!date) e.date = 'Укажите дату'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Укажите сумму'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onAdd({
      date,
      siteId: siteId ? Number(siteId) : null,
      amount: Number(amount),
    })
    onClose()
  }

  return (
    <Modal opened onClose={onClose} title="Добавить доход" centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Input
            label="Дата"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            error={errors.date}
          />

          <Select
            label="Сайт"
            value={siteId}
            onChange={value => setSiteId(value ?? '')}
            data={siteOptions}
            allowDeselect={false}
            comboboxProps={{ withinPortal: false }}
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
            <Button type="submit">
              Добавить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

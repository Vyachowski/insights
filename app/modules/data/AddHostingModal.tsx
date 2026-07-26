import { Group, Modal, Select, Stack } from '@mantine/core'
import Button from '@ui/Button'
import Input from '@ui/Input'
import { useState } from 'react'

import type { SiteDto as Site } from '@/lib/types'

interface HostingValues {
  year: string
  siteId: string
  amount: string
}

interface AddHostingModalProps {
  sites: Site[]
  submitting: boolean
  onClose: () => void
  onSubmit: (values: HostingValues) => void
}

function siteLabel(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

// Hosting is billed once a year, so the date is a plain year picker.
const YEARS = Array.from({ length: 7 }, (_, i) => String(new Date().getFullYear() + 1 - i))

export default function AddHostingModal({ sites, submitting, onClose, onSubmit }: AddHostingModalProps) {
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [siteId, setSiteId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const siteOptions = [
    { value: '', label: 'Общий (компания)' },
    ...sites.map(site => ({ value: String(site.id), label: siteLabel(site.url) })),
  ]

  function validate() {
    const e: Record<string, string> = {}
    if (!year) e.year = 'Укажите год'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Укажите сумму'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({ year, siteId, amount })
  }

  // Future: this modal may host other expense types; for now only hosting.
  return (
    <Modal opened onClose={onClose} title="Добавить хостинг" centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Select
            label="Год"
            value={year}
            onChange={value => setYear(value ?? '')}
            data={YEARS}
            allowDeselect={false}
            error={errors.year}
            comboboxProps={{ withinPortal: false }}
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
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Сохранение…' : 'Добавить'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

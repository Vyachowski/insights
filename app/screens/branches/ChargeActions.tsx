import { Group } from '@mantine/core'

import Button from '@/components/Button'

interface ChargeActionsProps {
  enabled: boolean
  disabled: boolean
  canEnable?: boolean
  onEdit: () => void
  onSwitchOff: () => void
}

export default function ChargeActions({ enabled, disabled, canEnable = true, onEdit, onSwitchOff }: ChargeActionsProps) {
  if (!enabled) {
    return (
      <Button size="sm" variant="secondary" disabled={disabled || !canEnable} onClick={onEdit}>
        Включить
      </Button>
    )
  }
  return (
    <Group gap="xs" justify="flex-end" wrap="nowrap">
      <Button size="sm" variant="secondary" disabled={disabled} onClick={onEdit}>Изменить</Button>
      <Button size="sm" variant="ghost" disabled={disabled} onClick={onSwitchOff}>Выключить</Button>
    </Group>
  )
}

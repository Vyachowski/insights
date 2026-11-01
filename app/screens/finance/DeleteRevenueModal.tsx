import { Group, Modal, Stack, Text } from '@mantine/core'

import type { Revenue } from '@/server/db/queries/revenues'
import type { Site } from '@/server/db/queries/sites'

import Button from '@/components/Button'
import { formatAmount, formatDate, getSiteName } from '@/lib/format'

interface DeleteRevenueModalProps {
  entry: Revenue
  sites: Site[]
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteRevenueModal({ entry, sites, onClose, onConfirm }: DeleteRevenueModalProps) {
  const siteName = entry.siteId === null ? 'Общий' : getSiteName(entry.siteId, sites)

  return (
    <Modal opened onClose={onClose} title="Удалить доход" centered>
      <Stack gap="md">
        <Text size="sm">
          {`${formatDate(entry.date)}, ${siteName}, ${formatAmount(entry.amount)}. Запись удалится навсегда, итоги в Сводке изменятся.`}
        </Text>
        <Group justify="flex-end" gap="sm" pt="xs">
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            Удалить
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

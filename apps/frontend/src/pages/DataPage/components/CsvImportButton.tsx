import { Group, Text } from '@mantine/core'
import Button from '@ui/Button'
import { Upload, CheckCircle, XCircle } from 'lucide-react'
import { useRef, useState } from 'react'

import { useAuth } from '@/hooks/useAuth'

interface ImportResult {
  created: number
  skipped: number
}

interface CsvImportButtonProps {
  onImport: (file: File) => Promise<ImportResult>
  onSuccess?: () => void
  label?: string
}

export default function CsvImportButton({ onImport, onSuccess, label = 'Импорт CSV' }: CsvImportButtonProps) {
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!user?.isAdmin) return null

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await onImport(file)
      setResult(res)
      onSuccess?.()
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? 'Ошибка импорта')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <Group gap="sm">
      {result && (
        <Group gap={6} c="teal">
          <CheckCircle size={13} />
          <Text size="xs">
            +{result.created} загружено{result.skipped > 0 ? `, ${result.skipped} пропущено` : ''}
          </Text>
        </Group>
      )}
      {error && (
        <Group gap={6} c="red">
          <XCircle size={13} />
          <Text size="xs">{error}</Text>
        </Group>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={handleChange}
      />
      <Button
        size="sm"
        variant="secondary"
        isLoading={loading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={15} />
        {label}
      </Button>
    </Group>
  )
}

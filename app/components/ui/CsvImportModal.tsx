import { Box, Divider, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import Button from '@ui/Button'
import { AlertTriangle, CheckCircle, MinusCircle, Upload, XCircle } from 'lucide-react'
import { useRef, useState } from 'react'

import type { ImportResultDto as ImportResult } from '@/lib/types'

type ResultStatus = 'success' | 'ignored' | 'mixed' | 'empty'

function resultStatus(r: ImportResult): ResultStatus {
  const added = r.created + (r.updated ?? 0)
  if (added > 0 && r.skipped > 0) return 'mixed'
  if (added > 0) return 'success'
  if (r.skipped > 0) return 'ignored'
  return 'empty'
}

const STATUS_STYLE: Record<ResultStatus, { color: string, Icon: typeof CheckCircle }> = {
  success: { color: 'teal', Icon: CheckCircle },
  mixed: { color: 'yellow', Icon: AlertTriangle },
  ignored: { color: 'yellow', Icon: AlertTriangle },
  empty: { color: 'dimmed', Icon: MinusCircle },
}

export interface CsvImportConfig {
  title: string
  onImportFile: (file: File) => Promise<ImportResult>
  onImportUrl: (url: string) => Promise<ImportResult>
  onSuccess?: () => void
}

interface Props {
  config: CsvImportConfig
  onClose: () => void
}

export default function CsvImportModal({ config, onClose }: Props) {
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function isValidUrl(s: string) {
    try { const u = new URL(s); return u.protocol === 'https:' || u.protocol === 'http:' } catch { return false }
  }

  const canSubmit = !loading && (isValidUrl(url) || file !== null)

  async function run(action: () => Promise<ImportResult>) {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await action()
      setResult(res)
      config.onSuccess?.()
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? 'Ошибка импорта')
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    if (!picked) return
    setFile(picked)
    setUrl('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    if (file) {
      run(() => config.onImportFile(file)).then(() => {
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      })
    } else {
      run(() => config.onImportUrl(url.trim()))
    }
  }

  return (
    <Modal opened onClose={onClose} title={config.title} centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            type="url"
            placeholder="Вставьте ссылку на .csv файл"
            value={url}
            onChange={e => { setUrl(e.currentTarget.value); setFile(null) }}
            disabled={loading}
          />

          <Divider label="или" labelPosition="center" />

          <Box
            onClick={() => !loading && fileInputRef.current?.click()}
            p="lg"
            style={{
              cursor: loading ? 'default' : 'pointer',
              borderRadius: 'var(--mantine-radius-md)',
              border: `2px dashed var(--mantine-color-${file ? 'teal-5' : 'default-border'})`,
            }}
          >
            <Stack align="center" gap="xs">
              <Upload
                size={24}
                color={file ? 'var(--mantine-color-teal-4)' : 'var(--mantine-color-dimmed)'}
              />
              {file ? (
                <Text size="sm" c="teal" fw={500} truncate="end">{file.name}</Text>
              ) : (
                <Text size="sm" c="dimmed" ta="center">
                  Нажмите чтобы выбрать <Text span c="teal">.csv</Text> файл
                </Text>
              )}
            </Stack>
          </Box>
          <input ref={fileInputRef} type="file" accept=".csv" hidden onChange={handleFileChange} />

          {result && (() => {
            const { color, Icon } = STATUS_STYLE[resultStatus(result)]
            return (
              <Group gap="xs" c={color}>
                <Icon size={15} />
                <Text size="sm">
                  {[
                    result.created > 0 && `+${result.created} создано`,
                    result.updated != null && result.updated > 0 && `${result.updated} обновлено`,
                    result.skipped > 0 && `${result.skipped} пропущено`,
                  ].filter(Boolean).join(', ') || 'Без изменений'}
                </Text>
              </Group>
            )
          })()}
          {error && (
            <Group gap="xs" c="red">
              <XCircle size={15} />
              <Text size="sm">{error}</Text>
            </Group>
          )}

          {result ? (
            <Button type="button" onClick={onClose}>
              Готово
            </Button>
          ) : (
            <Button type="submit" isLoading={loading} disabled={!canSubmit}>
              <Upload size={15} />
              Загрузить
            </Button>
          )}
        </Stack>
      </form>
    </Modal>
  )
}

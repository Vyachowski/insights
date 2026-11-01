import { useState } from 'react'
import { useRevalidator } from 'react-router'

import type { CsvImportConfig } from '@/components/CsvImportModal'
import type { ImportResource } from '@/server/services/csv-imports'

import { importFile, importUrl } from '@/lib/import-client'

/** The open import modal of a screen; `config` is null while it is closed. */
export function useCsvImport<T extends ImportResource>(titles: Record<T, string>) {
  const revalidator = useRevalidator()
  const [target, setTarget] = useState<T | null>(null)

  const config: CsvImportConfig | null = target
    ? {
      title: titles[target],
      onImportFile: file => importFile(target, file),
      onImportUrl: url => importUrl(target, url),
      onSuccess: () => revalidator.revalidate(),
    }
    : null

  return { config, open: setTarget, close: () => setTarget(null) }
}

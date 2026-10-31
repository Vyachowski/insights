import { useState } from 'react'
import { useRevalidator } from 'react-router'

import type { ImportResource } from '@/server/services/csv-imports'
import type { CsvImportConfig } from '@ui/CsvImportModal'

import { importFile, importUrl } from '@/lib/importClient'

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

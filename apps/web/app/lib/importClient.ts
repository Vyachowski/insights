import type { ImportResultDto } from '@/lib/types'

async function postImport(form: FormData): Promise<ImportResultDto> {
  const res = await fetch('/import', { method: 'POST', body: form })
  const body: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const message
      = body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : `Import failed: ${res.status}`
    throw { message }
  }
  return body as ImportResultDto
}

export function importFile(resource: string, file: File) {
  const form = new FormData()
  form.set('intent', resource)
  form.set('file', file)
  return postImport(form)
}

export function importUrl(resource: string, url: string) {
  const form = new FormData()
  form.set('intent', resource)
  form.set('url', url)
  return postImport(form)
}

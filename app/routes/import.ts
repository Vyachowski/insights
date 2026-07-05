import type { Route } from './+types/import'

import { requireAdmin } from '@/server/auth'
import {
  CsvValidationError,
  fetchUrlToBuffer,
  importers,
  type ImportResource,
} from '@/server/imports'

// Resource route: the single mutation endpoint for CSV imports.
// Accepts multipart form data: `intent` = resource name, plus either
// `file` (upload) or `url` (fetch-by-URL).
export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request)

  const form = await request.formData()
  const intent = String(form.get('intent') ?? '')
  const importer = importers[intent as ImportResource]
  if (!importer) {
    return Response.json({ error: `Unknown import: ${intent}` }, { status: 400 })
  }

  try {
    const buffer = await readCsvBuffer(form)
    return Response.json(await importer(buffer))
  } catch (error) {
    if (error instanceof CsvValidationError) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}

async function readCsvBuffer(form: FormData): Promise<Buffer> {
  const file = form.get('file')
  if (file instanceof File && file.size > 0) {
    return Buffer.from(await file.arrayBuffer())
  }
  const url = form.get('url')
  if (typeof url === 'string' && url.length > 0) {
    return fetchUrlToBuffer(url)
  }
  throw new CsvValidationError('Provide a CSV file or a URL')
}

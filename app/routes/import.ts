import type { Route } from './+types/import'

import { requireAdmin } from '@/routes/helpers/auth'
import {
  CsvValidationError,
  importCsvFromUrl,
  importers,
  type ImportResource,
} from '@/server/services/csv-imports'

// Resource route: the single mutation endpoint for CSV imports.
// Accepts multipart form data: `intent` = resource name, plus either
// `file` (upload) or `url` (fetch-by-URL).
export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request)

  const form = await request.formData()
  const intent = String(form.get('intent') ?? '')
  if (!Object.hasOwn(importers, intent)) {
    return Response.json({ error: `Unknown import: ${intent}` }, { status: 400 })
  }

  try {
    return Response.json(await runImport(form, intent as ImportResource))
  } catch (error) {
    if (error instanceof CsvValidationError) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}

async function runImport(form: FormData, resource: ImportResource) {
  const file = form.get('file')
  if (file instanceof File && file.size > 0) {
    return importers[resource](Buffer.from(await file.arrayBuffer()))
  }
  const url = form.get('url')
  if (typeof url === 'string' && url.length > 0) {
    return importCsvFromUrl(resource, url)
  }
  throw new CsvValidationError('Provide a CSV file or a URL')
}

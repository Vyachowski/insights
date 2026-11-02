import { CsvValidationError } from '@/server/core/csv'

const FETCH_TIMEOUT_MS = 30_000
const MAX_CSV_BYTES = 50 * 1024 * 1024

// Reads in chunks, because a server can leave out Content-Length or lie in it
async function readBody(res: Response): Promise<Buffer> {
  const reader = res.body?.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > MAX_CSV_BYTES) {
      await reader.cancel()
      throw new CsvValidationError('Failed to fetch URL: over 50 MB')
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function fetchCsvBuffer(url: string): Promise<Buffer> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
    if (!res.ok) {
      throw new CsvValidationError(`Failed to fetch URL: ${res.status}`)
    }
    return await readBody(res)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new CsvValidationError('Failed to fetch URL: no reply in 30 s')
    }
    throw error
  }
}

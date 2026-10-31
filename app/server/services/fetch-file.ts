import { CsvValidationError } from '@/server/core/csv'

export async function fetchUrlToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new CsvValidationError(`Failed to fetch URL: ${res.status}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

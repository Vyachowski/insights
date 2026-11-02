import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchCsvBuffer } from './fetch-csv'

import { CsvValidationError } from '@/server/core/csv'

const MEGABYTE = 1024 * 1024

function streamOf(megabytes: number) {
  let sent = 0
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (sent === megabytes) return controller.close()
      sent += 1
      controller.enqueue(new Uint8Array(MEGABYTE))
    },
  })
  return { body, sentMegabytes: () => sent }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchCsvBuffer', () => {
  it('returns the body of a good reply', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('date,amount\n')))

    const buffer = await fetchCsvBuffer('https://example.com/a.csv')

    expect(buffer.toString()).toBe('date,amount\n')
  })

  it('refuses a failed reply', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })))

    await expect(fetchCsvBuffer('https://example.com/a.csv'))
      .rejects.toThrow(new CsvValidationError('Failed to fetch URL: 404'))
  })

  it('stops reading a body past the limit', async () => {
    const { body, sentMegabytes } = streamOf(200)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body)))

    await expect(fetchCsvBuffer('https://example.com/a.csv'))
      .rejects.toThrow(new CsvValidationError('Failed to fetch URL: over 50 MB'))
    expect(sentMegabytes()).toBeLessThan(60)
  })

  it('gives up on a silent server', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new DOMException('slow', 'TimeoutError'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchCsvBuffer('https://example.com/a.csv'))
      .rejects.toThrow(new CsvValidationError('Failed to fetch URL: no reply in 30 s'))
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal)
  })
})

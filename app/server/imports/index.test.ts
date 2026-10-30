import { describe, expect, it, vi } from 'vitest'

vi.mock('@/server/db', () => ({ db: {} }))

const { CsvValidationError, importers } = await import('./index')

describe('calls import', () => {
  it('is switched off with a clear message', async () => {
    const result = importers.calls()
    await expect(result).rejects.toBeInstanceOf(CsvValidationError)
    await expect(result).rejects.toThrow('Импорт звонков временно отключён')
  })
})

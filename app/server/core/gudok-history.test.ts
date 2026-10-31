import { describe, expect, it } from 'vitest'

import { cleanProject, parseGudokAmountKopecks, parseGudokOperationDate } from './gudok-history'

describe('parseGudokAmountKopecks', () => {
  it('parses comma-decimal ruble strings to positive kopecks', () => {
    expect(parseGudokAmountKopecks('-870,000 i')).toBe(87000)
    expect(parseGudokAmountKopecks('870,000')).toBe(87000)
    expect(parseGudokAmountKopecks('-1 234,50')).toBe(123450)
  })
  it('returns null on garbage', () => {
    expect(parseGudokAmountKopecks('—')).toBeNull()
  })
})

describe('parseGudokOperationDate', () => {
  it('parses DD.MM.YY and DD.MM.YYYY', () => {
    expect(parseGudokOperationDate('26.07.26')).toBe('2026-07-26')
    expect(parseGudokOperationDate('24.07.2026')).toBe('2026-07-24')
  })
})

describe('cleanProject', () => {
  it('strips trailing dots', () => {
    expect(cleanProject('Волгоград..')).toBe('Волгоград')
  })
})

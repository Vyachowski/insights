import { describe, expect, it } from 'vitest'

import { GudokPayloadError } from './gudok-calls'
import { cleanProject, parseGudokAmountKopecks, parseGudokOperationDate, parseGudokPeriod } from './gudok-history'

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

describe('parseGudokPeriod', () => {
  it('returns the period, including a single day and a leap day', () => {
    expect(parseGudokPeriod({ start: '2026-10-01', end: '2026-10-31' })).toEqual({ start: '2026-10-01', end: '2026-10-31' })
    expect(parseGudokPeriod({ start: '2026-10-31', end: '2026-10-31' })).toEqual({ start: '2026-10-31', end: '2026-10-31' })
    expect(parseGudokPeriod({ start: '2024-02-29', end: '2024-03-01' })).toEqual({ start: '2024-02-29', end: '2024-03-01' })
  })

  it.each([
    ['a day past the month end', { start: '2026-02-31', end: '2026-03-01' }],
    ['a leap day in a common year', { start: '2026-02-29', end: '2026-03-01' }],
    ['a bad end', { start: '2026-10-01', end: '2026-04-31' }],
    ['month 13', { start: '2026-13-01', end: '2026-13-02' }],
    ['day 00', { start: '2026-10-00', end: '2026-10-01' }],
    ['a date with a time', { start: '2026-10-01T00:00:00Z', end: '2026-10-31' }],
    ['a Gudok date', { start: '01.10.2026', end: '31.10.2026' }],
    ['a number', { start: 20261001, end: 20261031 }],
    ['a missing end', { start: '2026-10-01' }],
    ['an empty object', {}],
    ['null', null],
    ['a string', '2026-10-01'],
  ])('refuses %s', (_, period) => {
    expect(() => parseGudokPeriod(period)).toThrow(GudokPayloadError)
  })

  it('refuses a start after its end', () => {
    expect(() => parseGudokPeriod({ start: '2026-10-02', end: '2026-10-01' })).toThrow(GudokPayloadError)
  })
})

describe('cleanProject', () => {
  it('strips trailing dots', () => {
    expect(cleanProject('Волгоград..')).toBe('Волгоград')
  })
})

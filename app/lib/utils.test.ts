import { describe, expect, it } from 'vitest'

import { formatRub, formatRubDelta, formatYoyDelta } from './utils'

describe('formatYoyDelta', () => {
  const prevYear = new Date().getFullYear() - 1

  it('shows a signed percentage against a real baseline', () => {
    expect(formatYoyDelta(112, 100)).toBe(`+12% к ${prevYear}`)
    expect(formatYoyDelta(95, 100)).toBe(`−5% к ${prevYear}`)
    expect(formatYoyDelta(100, 100)).toBe(`0% к ${prevYear}`)
  })

  it('reads «новый» when there is no prior-year baseline', () => {
    expect(formatYoyDelta(300, 0)).toBe('новый')
  })

  it('reads «—» when both years are zero', () => {
    expect(formatYoyDelta(0, 0)).toBe('—')
  })
})

describe('formatRubDelta', () => {
  it('shows a signed ruble difference', () => {
    expect(formatRubDelta(112_000, 100_000)).toBe(`+${formatRub(12_000)}`)
    expect(formatRubDelta(95_000, 100_000)).toBe(`−${formatRub(5_000)}`)
  })

  it('has no sign when the difference is zero', () => {
    expect(formatRubDelta(100_000, 100_000)).toBe(formatRub(0))
  })
})

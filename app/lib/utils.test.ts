import { describe, expect, it } from 'vitest'

import { formatYoyDelta } from './utils'

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

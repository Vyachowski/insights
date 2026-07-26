import { describe, expect, it } from 'vitest'

import { computeVerdict, mergeCallsByCity } from './dashboard.calc'

describe('computeVerdict', () => {
  it('reports growth as year-over-year percent against last year', () => {
    const verdict = computeVerdict(1200, 1000)
    expect(verdict.isGrowing).toBe(true)
    expect(verdict.growthPercent).toBe(20)
    expect(verdict.current).toBe(1200)
    expect(verdict.previous).toBe(1000)
  })

  it('flags a strong swing at or beyond 20%', () => {
    expect(computeVerdict(1000, 1250).isStrong).toBe(true) // -20% exactly on threshold
    expect(computeVerdict(1100, 1000).isStrong).toBe(false) // +10%
    expect(computeVerdict(1300, 1000).isStrong).toBe(true) // +30%
  })

  it('handles a profit that crosses into a loss', () => {
    const verdict = computeVerdict(-134160, 427388)
    expect(verdict.isGrowing).toBe(false)
    expect(verdict.growthPercent).toBe(-131.4)
    expect(verdict.isStrong).toBe(true)
  })

  it('avoids dividing by zero when last year was zero', () => {
    const verdict = computeVerdict(500, 0)
    expect(verdict.growthPercent).toBe(0)
    expect(verdict.isGrowing).toBe(true)
  })
})

describe('mergeCallsByCity', () => {
  const cities = [
    { id: 1, name: 'Москва' },
    { id: 2, name: 'Казань' },
    { id: 3, name: 'Пермь' },
  ]

  it('ranks cities by current-year calls, descending', () => {
    const result = mergeCallsByCity(
      cities,
      [
        { cityId: 1, city: 'Москва', count: 400 },
        { cityId: 2, city: 'Казань', count: 900 },
      ],
      [{ cityId: 2, city: 'Казань', count: 800 }],
    )
    expect(result.map(r => r.city)).toEqual(['Казань', 'Москва', 'Пермь'])
  })

  it('fills missing periods with zero for every city', () => {
    const result = mergeCallsByCity(cities, [], [])
    expect(result).toHaveLength(3)
    expect(result.every(r => r.current === 0 && r.previous === 0)).toBe(true)
  })

  it('keeps both current and previous counts per city', () => {
    const [top] = mergeCallsByCity(
      cities,
      [{ cityId: 2, city: 'Казань', count: 900 }],
      [{ cityId: 2, city: 'Казань', count: 875 }],
    )
    expect(top).toEqual({ city: 'Казань', current: 900, previous: 875 })
  })
})

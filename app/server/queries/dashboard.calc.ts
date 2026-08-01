import type { CityCallsDto, VerdictDto } from '@/lib/types'

// Below this absolute year-over-year swing the verdict reads as gradual;
// at or above it the «сильно» qualifier is added.
export const STRONG_SWING_PERCENT = 20

export function computeVerdict(
  current: number,
  previous: number,
): Omit<VerdictDto, 'monthlyCurrent' | 'monthlyPrevious'> {
  const growthPercent
    = previous !== 0 ? ((current - previous) / Math.abs(previous)) * 100 : 0

  return {
    isGrowing: current >= previous,
    isStrong: Math.abs(growthPercent) >= STRONG_SWING_PERCENT,
    growthPercent: Number(growthPercent.toFixed(1)),
    current,
    previous,
  }
}

interface CityCallRow {
  cityId: number;
  city: string;
  count: number;
}

export function mergeCallsByCity(
  cities: { id: number; name: string }[],
  currentRows: CityCallRow[],
  previousRows: CityCallRow[],
): CityCallsDto[] {
  const currentByCity = new Map(currentRows.map(r => [r.cityId, r.count]))
  const previousByCity = new Map(previousRows.map(r => [r.cityId, r.count]))

  return cities
    .map(city => ({
      city: city.name,
      current: currentByCity.get(city.id) ?? 0,
      previous: previousByCity.get(city.id) ?? 0,
    }))
    .filter(c => c.current !== 0 || c.previous !== 0)
    .sort((a, b) => b.current - a.current)
}

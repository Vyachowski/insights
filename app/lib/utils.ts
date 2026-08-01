export const formatNumber = (num: number) =>
  new Intl.NumberFormat('ru-RU').format(num)

export const formatRub = (num: number) => `${formatNumber(Math.round(num))} ₽`

// Signed ruble difference of `current` against `previous` (e.g. «+12 400 ₽», «−3 500 ₽»).
// Uses U+2212 for the minus, matching the percent-delta sign; a zero difference has no sign.
export const formatRubDelta = (current: number, previous: number) => {
  const diff = current - previous
  const rounded = Math.round(diff)
  const sign = rounded > 0 ? '+' : rounded < 0 ? '−' : ''
  return `${sign}${formatRub(Math.abs(diff))}`
}

// Year-over-year change of `current` against `previous`, as a full label with the
// previous year in the suffix. With no prior-year baseline a percentage is undefined,
// so report «новый» (appeared this year) or «—» (no data either year) instead of a
// misleading «0%».
export const formatYoyDelta = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? '—' : 'новый'
  const prevYear = new Date().getFullYear() - 1
  const percent = Math.round(((current - previous) / Math.abs(previous)) * 100)
  const sign = percent > 0 ? '+' : percent < 0 ? '−' : ''
  return `${sign}${Math.abs(percent)}% к ${prevYear}`
}

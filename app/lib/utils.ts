export const formatNumber = (num: number) =>
  new Intl.NumberFormat('ru-RU').format(num)

export const formatRub = (num: number) => `${formatNumber(Math.round(num))} ₽`

// Year-over-year change of `current` against `previous`, with an explicit sign.
export const formatDeltaPercent = (current: number, previous: number) => {
  const percent
    = previous !== 0 ? Math.round(((current - previous) / Math.abs(previous)) * 100) : 0
  const sign = percent > 0 ? '+' : percent < 0 ? '−' : ''
  return `${sign}${Math.abs(percent)}%`
}

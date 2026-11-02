// Shape check plus a round-trip so calendar-invalid dates like 2024-02-30 or
// 2024-13-01 are rejected regardless of the engine's date-parsing leniency.
export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

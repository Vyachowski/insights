interface Props {
  value: number
  onChange: (year: number) => void
  startYear?: number
}

export default function YearSelect({ value, onChange, startYear = 2020 }: Props) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i)

  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
    >
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  )
}

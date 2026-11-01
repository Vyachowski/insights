import { Select } from '@mantine/core'

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

interface Props {
  value: number | null
  onChange: (month: number | null) => void
  months: number[]
}

export default function MonthSelect({ value, onChange, months }: Props) {
  return (
    <Select
      value={value === null ? null : String(value)}
      onChange={v => onChange(v === null ? null : Number(v))}
      data={months.map(m => ({ value: String(m), label: MONTH_NAMES[m] }))}
      placeholder="Все месяцы"
      clearable
      checkIconPosition="right"
      w={140}
    />
  )
}

import { Select } from '@mantine/core'

interface Props {
  value: number
  onChange: (year: number) => void
  years: number[]
}

export default function YearSelect({ value, onChange, years }: Props) {
  return (
    <Select
      value={String(value)}
      onChange={v => v && onChange(Number(v))}
      data={years.map(String)}
      allowDeselect={false}
      checkIconPosition="right"
      w={110}
    />
  )
}

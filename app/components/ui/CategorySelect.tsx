import { Select } from '@mantine/core'

interface Props {
  value: string | null
  onChange: (category: string | null) => void
  categories: string[]
}

export default function CategorySelect({ value, onChange, categories }: Props) {
  return (
    <Select
      value={value}
      onChange={onChange}
      data={categories}
      placeholder="Все категории"
      clearable
      checkIconPosition="right"
      w={180}
    />
  )
}

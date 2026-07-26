import { SegmentedControl } from '@mantine/core'

export type ValueMode = 'pct' | 'abs'

export default function ValueModeToggle({
  value,
  onChange,
}: {
  value: ValueMode
  onChange: (value: ValueMode) => void
}) {
  return (
    <SegmentedControl
      size="xs"
      value={value}
      onChange={mode => onChange(mode as ValueMode)}
      data={[
        { label: '%', value: 'pct' },
        { label: 'абс.', value: 'abs' },
      ]}
    />
  )
}

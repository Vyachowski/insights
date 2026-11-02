import { useCallback, useMemo, useState } from 'react'

export function useCategoryFilter(rows: { type: string }[]) {
  const [selected, setSelected] = useState<string | null>(null)
  const categories = useMemo(() => [...new Set(rows.map(row => row.type))].sort(), [rows])
  const matches = useCallback(
    (row: { type: string }) => selected === null || row.type === selected,
    [selected],
  )

  return { categories, selected, setSelected, matches }
}

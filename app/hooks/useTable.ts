import { useMemo, useState } from 'react'

const PAGE_SIZE = 20

/** Newest first, cut into pages. */
export function useTable<T extends { date: string | Date }>(entries: T[]) {
  const [page, setPage] = useState(1)

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [entries],
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)

  return {
    rows: sorted.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE),
    page: clampedPage,
    setPage,
    totalPages,
    total: sorted.length,
    firstRow: (clampedPage - 1) * PAGE_SIZE + 1,
    lastRow: Math.min(clampedPage * PAGE_SIZE, sorted.length),
  }
}

export type Table = ReturnType<typeof useTable>

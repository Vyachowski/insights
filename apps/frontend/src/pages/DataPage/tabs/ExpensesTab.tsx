import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ExpensesTabView from './ExpensesTabView'

import type { AppDispatch } from '@/store'

import { selectImportTick } from '@/store/selectors/appSelectors'
import { selectExpensesByYear, selectExpensesError, selectExpensesLoading, selectExpenseYears } from '@/store/selectors/expensesSelectors'
import { selectSites } from '@/store/selectors/sitesSelectors'
import { openImportModal } from '@/store/slices/appSlice'
import { fetchExpenses } from '@/store/thunks/expensesThunks'
import { fetchSites } from '@/store/thunks/sitesThunks'

export default function ExpensesTab() {
  const dispatch = useDispatch<AppDispatch>()
  const importTick = useSelector(selectImportTick('expenses'))

  const loading = useSelector(selectExpensesLoading)
  const error = useSelector(selectExpensesError)
  const availableYears = useSelector(selectExpenseYears)

  const sites = useSelector(selectSites)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const effectiveYear = selectedYear ?? availableYears[0] ?? null

  useEffect(() => { dispatch(fetchSites()) }, [dispatch])

  useEffect(() => { dispatch(fetchExpenses()) }, [importTick, dispatch])

  const entries = useSelector(
    useMemo(() => effectiveYear !== null ? selectExpensesByYear(effectiveYear) : () => [], [effectiveYear]),
  )

  return (
    <ExpensesTabView
      loading={loading}
      error={error}
      entries={entries}
      sites={sites}
      effectiveYear={effectiveYear}
      availableYears={availableYears}
      onYearChange={setSelectedYear}
      onImportClick={() => dispatch(openImportModal('expenses'))}
    />
  )
}

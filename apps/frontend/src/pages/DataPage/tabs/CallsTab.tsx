import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CallsTabView from './CallsTabView'

import type { AppDispatch } from '@/store'

import { selectImportTick } from '@/store/selectors/appSelectors'
import { selectCallsByYear, selectCallsError, selectCallsLoading, selectCallYears } from '@/store/selectors/callsSelectors'
import { openImportModal } from '@/store/slices/appSlice'
import { fetchCalls } from '@/store/thunks/callsThunks'

export default function CallsTab() {
  const dispatch = useDispatch<AppDispatch>()
  const importTick = useSelector(selectImportTick('calls'))

  const loading = useSelector(selectCallsLoading)
  const error = useSelector(selectCallsError)
  const availableYears = useSelector(selectCallYears)

  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const effectiveYear = selectedYear ?? availableYears[0] ?? null

  useEffect(() => { dispatch(fetchCalls()) }, [importTick, dispatch])

  const entries = useSelector(
    useMemo(() => effectiveYear !== null ? selectCallsByYear(effectiveYear) : () => [], [effectiveYear]),
  )

  return (
    <CallsTabView
      loading={loading}
      error={error}
      entries={entries}
      effectiveYear={effectiveYear}
      availableYears={availableYears}
      onYearChange={setSelectedYear}
      onImportClick={() => dispatch(openImportModal('calls'))}
    />
  )
}

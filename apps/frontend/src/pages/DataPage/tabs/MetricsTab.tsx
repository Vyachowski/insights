import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import MetricsTabView from './MetricsTabView'

import type { AppDispatch } from '@/store'

import { selectImportTick } from '@/store/selectors/appSelectors'
import { selectMetricsByYear, selectMetricsError, selectMetricsLoading, selectMetricYears } from '@/store/selectors/metricsSelectors'
import { selectSites } from '@/store/selectors/sitesSelectors'
import { openImportModal } from '@/store/slices/appSlice'
import { fetchMetrics } from '@/store/thunks/metricsThunks'
import { fetchSites } from '@/store/thunks/sitesThunks'

export default function MetricsTab() {
  const dispatch = useDispatch<AppDispatch>()
  const importTick = useSelector(selectImportTick('metrics'))

  const loading = useSelector(selectMetricsLoading)
  const error = useSelector(selectMetricsError)
  const availableYears = useSelector(selectMetricYears)

  const sites = useSelector(selectSites)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const effectiveYear = selectedYear ?? availableYears[0] ?? null

  useEffect(() => { dispatch(fetchSites()) }, [dispatch])

  useEffect(() => { dispatch(fetchMetrics()) }, [importTick, dispatch])

  const entries = useSelector(
    useMemo(() => effectiveYear !== null ? selectMetricsByYear(effectiveYear) : () => [], [effectiveYear]),
  )

  return (
    <MetricsTabView
      loading={loading}
      error={error}
      entries={entries}
      sites={sites}
      effectiveYear={effectiveYear}
      availableYears={availableYears}
      onYearChange={setSelectedYear}
      onImportClick={() => dispatch(openImportModal('metrics'))}
    />
  )
}

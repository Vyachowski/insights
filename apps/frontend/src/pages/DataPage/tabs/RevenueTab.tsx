import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import RevenueTabView from './RevenueTabView'

import type { AppDispatch } from '@/store'
import type { Revenue, Site } from '@insights/contracts'

import { sitesApi } from '@/api/sites'
import { useAuth } from '@/hooks/useAuth'
import { selectImportTick } from '@/store/selectors/appSelectors'
import { selectRevenueByYear, selectRevenueError, selectRevenueLoading, selectRevenueYears } from '@/store/selectors/revenueSelectors'
import { openImportModal } from '@/store/slices/appSlice'
import { addRevenue, removeRevenue } from '@/store/slices/revenueSlice'
import { fetchRevenue } from '@/store/thunks/revenueThunks'

export default function RevenueTab() {
  const dispatch = useDispatch<AppDispatch>()
  const importTick = useSelector(selectImportTick('revenue'))
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const loading = useSelector(selectRevenueLoading)
  const error = useSelector(selectRevenueError)
  const availableYears = useSelector(selectRevenueYears)

  const [sites, setSites] = useState<Site[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const effectiveYear = selectedYear ?? availableYears[0] ?? null

  useEffect(() => {
    sitesApi.fetchAll().then(setSites).catch(() => {})
  }, [])

  useEffect(() => { dispatch(fetchRevenue()) }, [importTick, dispatch])

  const entries = useSelector(
    useMemo(() => effectiveYear !== null ? selectRevenueByYear(effectiveYear) : () => [], [effectiveYear]),
  )

  function handleAdd(entry: Omit<Revenue, 'id'>) {
    const tempId = -(Date.now() * 1000 + Math.floor(Math.random() * 1000))
    dispatch(addRevenue({ ...entry, id: tempId }))
  }

  return (
    <RevenueTabView
      loading={loading}
      error={error}
      entries={entries}
      sites={sites}
      isAdmin={isAdmin}
      effectiveYear={effectiveYear}
      availableYears={availableYears}
      showModal={showModal}
      onYearChange={setSelectedYear}
      onImportClick={() => dispatch(openImportModal('revenue'))}
      onAddClick={() => setShowModal(true)}
      onRemove={id => dispatch(removeRevenue(id))}
      onModalClose={() => setShowModal(false)}
      onModalAdd={handleAdd}
    />
  )
}

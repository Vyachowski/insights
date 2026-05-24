import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { useDispatch, useSelector } from 'react-redux'

import { callsApi } from '@/api/calls'
import { expensesApi } from '@/api/expenses'
import { metricsApi } from '@/api/metrics'
import { revenueApi } from '@/api/revenue'
import { selectActiveModal } from '@/store/selectors/appSelectors'
import { bumpImportTick, closeModal, type ImportModalTarget } from '@/store/slices/appSlice'

const CONFIGS: Record<ImportModalTarget, Omit<CsvImportConfig, 'onSuccess'>> = {
  expenses: {
    title: 'Импорт расходов',
    onImportFile: expensesApi.uploadCsv,
    onImportUrl: expensesApi.uploadUrl,
  },
  revenue: {
    title: 'Импорт доходов',
    onImportFile: revenueApi.uploadCsv,
    onImportUrl: revenueApi.uploadUrl,
  },
  calls: {
    title: 'Импорт звонков',
    onImportFile: callsApi.uploadCsv,
    onImportUrl: callsApi.uploadUrl,
  },
  metrics: {
    title: 'Импорт метрик',
    onImportFile: metricsApi.uploadCsv,
    onImportUrl: metricsApi.uploadUrl,
  },
}

export default function ModalManager() {
  const dispatch = useDispatch()
  const activeModal = useSelector(selectActiveModal)

  if (!activeModal || activeModal.type !== 'csv-import') return null

  const config = CONFIGS[activeModal.target]

  const target = activeModal.target

  return (
    <CsvImportModal
      config={{ ...config, onSuccess: () => dispatch(bumpImportTick(target)) }}
      onClose={() => dispatch(closeModal())}
    />
  )
}

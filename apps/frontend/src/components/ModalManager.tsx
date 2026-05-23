import { useDispatch, useSelector } from 'react-redux'

import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { callsApi } from '@/api/calls'
import { expensesApi } from '@/api/expenses'
import { metricsApi } from '@/api/metrics'
import { revenueApi } from '@/api/revenue'
import { bumpImportTick, closeModal, type ImportModalTarget } from '@/store/slices/appSlice'
import { selectActiveModal } from '@/store/selectors/appSelectors'

const CONFIGS: Record<ImportModalTarget, Omit<CsvImportConfig, 'onSuccess'>> = {
  expenses: {
    title: 'Импорт расходов',
    onImportFile: expensesApi.importCsv,
    onImportUrl: expensesApi.importUrl,
  },
  revenue: {
    title: 'Импорт доходов',
    onImportFile: revenueApi.importCsv,
    onImportUrl: revenueApi.importUrl,
  },
  calls: {
    title: 'Импорт звонков',
    onImportFile: callsApi.importCsv,
    onImportUrl: callsApi.importUrl,
  },
  metrics: {
    title: 'Импорт метрик',
    onImportFile: metricsApi.importCsv,
    onImportUrl: metricsApi.importUrl,
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

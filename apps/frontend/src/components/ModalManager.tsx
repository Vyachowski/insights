import CsvImportModal, { type CsvImportConfig } from '@ui/CsvImportModal'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch } from '@/store'

import { selectActiveModal } from '@/store/selectors/appSelectors'
import { bumpImportTick, closeModal, type ImportModalTarget } from '@/store/slices/appSlice'
import { importData } from '@/store/thunks/importThunks'

const TITLES: Record<ImportModalTarget, string> = {
  expenses: 'Импорт расходов',
  revenue: 'Импорт доходов',
  calls: 'Импорт звонков',
  metrics: 'Импорт метрик',
}

export default function ModalManager() {
  const dispatch = useDispatch<AppDispatch>()
  const activeModal = useSelector(selectActiveModal)

  if (!activeModal || activeModal.type !== 'csv-import') return null

  const target = activeModal.target

  const config: CsvImportConfig = {
    title: TITLES[target],
    onImportFile: file => dispatch(importData({ target, file })).unwrap(),
    onImportUrl: url => dispatch(importData({ target, url })).unwrap(),
    onSuccess: () => dispatch(bumpImportTick(target)),
  }

  return (
    <CsvImportModal
      config={config}
      onClose={() => dispatch(closeModal())}
    />
  )
}

import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'

export type ImportModalTarget = 'expenses' | 'revenue' | 'calls' | 'metrics'

interface AppSliceState {
  activeModal: { type: 'csv-import'; target: ImportModalTarget } | null
  importRefreshTick: Record<ImportModalTarget, number>
}

const initialState: AppSliceState = {
  activeModal: null,
  importRefreshTick: { expenses: 0, revenue: 0, calls: 0, metrics: 0 },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openImportModal: (state, action: PayloadAction<ImportModalTarget>) => {
      state.activeModal = { type: 'csv-import', target: action.payload }
    },
    closeModal: state => {
      state.activeModal = null
    },
    bumpImportTick: (state, action: PayloadAction<ImportModalTarget>) => {
      state.importRefreshTick[action.payload]++
    },
  },
})

export const { openImportModal, closeModal, bumpImportTick } = appSlice.actions
export default appSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'

type AppState = 'idle' | 'ready' | 'error'

export type ImportModalTarget = 'expenses' | 'revenue' | 'calls' | 'metrics'

interface AppSliceState {
  state: AppState
  error: string | null
  activeModal: { type: 'csv-import'; target: ImportModalTarget } | null
  importRefreshTick: Record<ImportModalTarget, number>
}

const initialState: AppSliceState = {
  state: 'idle',
  error: null,
  activeModal: null,
  importRefreshTick: { expenses: 0, revenue: 0, calls: 0, metrics: 0 },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppReady: state => {
      state.state = 'ready'
      state.error = null
    },
    setAppError: (state, action: PayloadAction<string>) => {
      state.state = 'error'
      state.error = action.payload
    },
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

export const { setAppReady, setAppError, openImportModal, closeModal, bumpImportTick } = appSlice.actions
export default appSlice.reducer

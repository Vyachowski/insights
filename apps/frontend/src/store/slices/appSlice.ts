import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'

type AppState = 'idle' | 'ready' | 'error'

interface AppSliceState {
  state: AppState
  error: string | null
}

const initialState: AppSliceState = {
  state: 'idle',
  error: null,
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
  },
})

export const { setAppReady, setAppError } = appSlice.actions
export default appSlice.reducer

import { configureStore } from '@reduxjs/toolkit'

import appSliceReducer from './slices/appSlice'
import authSliceReducr from './slices/authSlice'

export const store = configureStore({
  reducer: {
    app: appSliceReducer,
    auth: authSliceReducr,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

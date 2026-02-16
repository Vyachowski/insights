import { configureStore } from '@reduxjs/toolkit'

import { authMiddleware } from './middlewares/authMiddlewares'
import appSliceReducer from './slices/appSlice'
import authSliceReducr from './slices/authSlice'

export const store = configureStore({
  reducer: {
    app: appSliceReducer,
    auth: authSliceReducr,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { configureStore } from '@reduxjs/toolkit'

import { authMiddleware } from './middlewares/authMiddlewares'
import appSliceReducer from './slices/appSlice'
import authSliceReducr from './slices/authSlice'
import callsReducer from './slices/callsSlice'
import citiesReducer from './slices/citiesSlice'
import dashboardReducer from './slices/dashboardSlice'
import expensesReducer from './slices/expensesSlice'
import metricsReducer from './slices/metricsSlice'
import revenueReducer from './slices/revenueSlice'
import sitesReducer from './slices/sitesSlice'

export const store = configureStore({
  reducer: {
    app: appSliceReducer,
    auth: authSliceReducr,
    dashboard: dashboardReducer,
    expenses: expensesReducer,
    revenue: revenueReducer,
    calls: callsReducer,
    metrics: metricsReducer,
    sites: sitesReducer,
    cities: citiesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

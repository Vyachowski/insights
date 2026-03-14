import type { RootState } from '..'

export const selectDashboardData = (state: RootState) => state.dashboard.data
export const selectDashboardLoading = (state: RootState) => state.dashboard.isLoading
export const selectDashboardError = (state: RootState) => state.dashboard.error

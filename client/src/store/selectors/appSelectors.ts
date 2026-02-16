import type { RootState } from '@/store'

export const selectAppState = (state: RootState) => state.app.state
export const selectAppError = (state: RootState) => state.app.error
export const selectIsAppReady = (state: RootState) => state.app.state === 'ready'

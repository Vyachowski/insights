import type { RootState } from '@/store'

export const selectAppState = (state: RootState) => state.app.state
export const selectAppError = (state: RootState) => state.app.error
export const selectIsAppReady = (state: RootState) => state.app.state === 'ready'
export const selectActiveModal = (state: RootState) => state.app.activeModal
export const selectImportTick = (target: string) => (state: RootState) =>
  state.app.importRefreshTick[target as keyof typeof state.app.importRefreshTick]

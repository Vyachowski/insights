import type { RootState } from '@/store'

export const selectActiveModal = (state: RootState) => state.app.activeModal
export const selectImportTick = (target: string) => (state: RootState) =>
  state.app.importRefreshTick[target as keyof typeof state.app.importRefreshTick]

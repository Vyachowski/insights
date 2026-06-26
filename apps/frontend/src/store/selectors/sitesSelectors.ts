import type { RootState } from '..'

export const selectSites = (state: RootState) => state.sites.data
export const selectSitesLoading = (state: RootState) => state.sites.isLoading
export const selectSitesError = (state: RootState) => state.sites.error

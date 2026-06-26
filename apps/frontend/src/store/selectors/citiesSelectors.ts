import type { RootState } from '..'

export const selectCities = (state: RootState) => state.cities.data
export const selectCitiesLoading = (state: RootState) => state.cities.isLoading
export const selectCitiesError = (state: RootState) => state.cities.error

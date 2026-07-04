import type { ApiSuccess, CityDto as City } from '@insights/contracts'

import axiosInstance from '@/lib/axios'
import { parseApiError } from '@/lib/parseApiError'

export const citiesApi = {
  fetchAll: async (): Promise<City[]> => {
    try {
      const { data: res } = await axiosInstance.get<ApiSuccess<City[]>>('/cities')
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },
}

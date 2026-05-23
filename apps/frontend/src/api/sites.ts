import type { ApiSuccess, Site } from '@insights/contracts'

import axiosInstance from '@/lib/axios'
import { parseApiError } from '@/lib/parseApiError'

export const sitesApi = {
  fetchAll: async (): Promise<Site[]> => {
    try {
      const { data: res } = await axiosInstance.get<ApiSuccess<Site[]>>('/sites')
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },
}

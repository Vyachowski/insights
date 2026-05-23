import type { ApiSuccess, Revenue } from '@insights/contracts'

import axiosInstance from '@/lib/axios'
import { parseApiError } from '@/lib/parseApiError'

export const revenueApi = {
  findAll: async (startDate: string, endDate: string): Promise<Revenue[]> => {
    try {
      const { data: res } = await axiosInstance.get<ApiSuccess<Revenue[]>>('/revenue', {
        params: { startDate, endDate },
      })
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },
}

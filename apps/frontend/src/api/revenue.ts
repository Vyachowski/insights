import type { ApiSuccess, ImportResult, Revenue } from '@insights/contracts'

import axiosInstance from '@/lib/axios'
import { parseApiError } from '@/lib/parseApiError'

export const revenueApi = {
  fetchAll: async (startDate?: string, endDate?: string): Promise<Revenue[]> => {
    try {
      const { data: res } = await axiosInstance.get<ApiSuccess<Revenue[]>>('/revenue', {
        params: { startDate, endDate },
      })
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },

  uploadCsv: async (file: File): Promise<ImportResult> => {
    try {
      const form = new FormData()
      form.append('file', file)
      const { data: res } = await axiosInstance.post<ApiSuccess<ImportResult>>('/revenue/import', form)
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },

  uploadUrl: async (url: string): Promise<ImportResult> => {
    try {
      const { data: res } = await axiosInstance.post<ApiSuccess<ImportResult>>('/revenue/import-url', { url })
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },
}

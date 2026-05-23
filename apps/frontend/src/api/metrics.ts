import type { ApiSuccess, ImportResult, SiteMetric } from '@insights/contracts'

import axiosInstance from '@/lib/axios'
import { parseApiError } from '@/lib/parseApiError'

export const metricsApi = {
  findAll: async (startDate?: string, endDate?: string): Promise<SiteMetric[]> => {
    try {
      const { data: res } = await axiosInstance.get<ApiSuccess<SiteMetric[]>>('/metrics', {
        params: { startDate, endDate },
      })
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },

  importCsv: async (file: File): Promise<ImportResult> => {
    try {
      const form = new FormData()
      form.append('file', file)
      const { data: res } = await axiosInstance.post<ApiSuccess<ImportResult>>('/metrics/import', form)
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },

  importUrl: async (url: string): Promise<ImportResult> => {
    try {
      const { data: res } = await axiosInstance.post<ApiSuccess<ImportResult>>('/metrics/import-url', { url })
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },
}

import type { ApiSuccess, CallImport, ImportResult } from '@insights/contracts'

import axiosInstance from '@/lib/axios'
import { parseApiError } from '@/lib/parseApiError'

export const callsApi = {
  findImports: async (startDate: string, endDate: string): Promise<CallImport[]> => {
    try {
      const { data: res } = await axiosInstance.get<ApiSuccess<CallImport[]>>('/calls/imports', {
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
      const { data: res } = await axiosInstance.post<ApiSuccess<ImportResult>>('/calls/import', form)
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },

  importUrl: async (url: string): Promise<ImportResult> => {
    try {
      const { data: res } = await axiosInstance.post<ApiSuccess<ImportResult>>('/calls/import-url', { url })
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },
}

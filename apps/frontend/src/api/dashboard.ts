import type { ApiSuccess, DashboardDto as DashboardResponse } from '@insights/contracts'

import axiosInstance from '@/lib/axios'
import { parseApiError } from '@/lib/parseApiError'

const endpoint = 'dashboard'

export const dashboardApi = {
  getDashboardSummary: async (): Promise<DashboardResponse> => {
    try {
      const { data: res } = await axiosInstance.get<ApiSuccess<DashboardResponse>>(`/${endpoint}/summary`)
      return res.data
    } catch (e) {
      throw parseApiError(e)
    }
  },
}

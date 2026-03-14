import type { DashboardResponse } from '@insights/contracts'

import axiosInstance from '@/lib/axios'

const endpoint = 'dashboard'

export const dashboardApi = {
  getDashboardSummary: async (): Promise<DashboardResponse> => {
    const { data } = await axiosInstance.get<DashboardResponse>(`/${endpoint}/summary`)
    return data
  },
}

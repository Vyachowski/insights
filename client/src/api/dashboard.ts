import type { DashboardResponse } from '@contracts/dashboard.contract'

import axiosInstance from '@/lib/axios'

const endpoint = 'dashboard'

export const dashboardApi = {
  getDashboardSummary: async (): Promise<DashboardResponse> => {
    const { data } = await axiosInstance.get<DashboardResponse>(`/${endpoint}/summary`)
    return data
  },
}

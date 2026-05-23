import type { ApiSuccess, DashboardResponse } from '@insights/contracts'

import axiosInstance from '@/lib/axios'

const endpoint = 'dashboard'

export const dashboardApi = {
  getDashboardSummary: async (): Promise<DashboardResponse> => {
    const { data: resData } = await axiosInstance.get<ApiSuccess<DashboardResponse>>(`/${endpoint}/summary`)
    return resData.data
  },
}

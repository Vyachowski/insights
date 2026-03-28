import type { ApiResponse } from '@/types'
import type { DashboardResponse } from '@insights/contracts'

import axiosInstance from '@/lib/axios'

const endpoint = 'dashboard'

export const dashboardApi = {
  getDashboardSummary: async (): Promise<DashboardResponse> => {
    const { data: resData } = await axiosInstance.get<ApiResponse<DashboardResponse>>(`/${endpoint}/summary`)

    return resData.data
  },
}

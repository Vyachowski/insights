import type { ResponseFinancialDto } from '../../../server/src/dashboard/dto/response-dashboard.dto'

import axiosInstance from '@/lib/axios'

const endpoint = 'dashboard'

export const dashboardApi = {
  getDashboardSummary: async (): Promise<ResponseFinancialDto> => {
    const { data } = await axiosInstance.get<ResponseFinancialDto>(`/${endpoint}/summary`)
    return data
  },
}

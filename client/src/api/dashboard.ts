import type { ResponseFinancialDto } from '../../../server/src/financial/dto/response-financial.dto'

import axiosInstance from '@/lib/axios'

const endpoint = 'dashboard'

export const dashboardApi = {
  getDashboardSummary: async (): Promise<ResponseFinancialDto> => {
    const { data } = await axiosInstance.get<ResponseFinancialDto>(`/${endpoint}/summary`)
    return data
  },
}

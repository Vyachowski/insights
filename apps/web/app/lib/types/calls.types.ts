export interface CallImportDto {
  id: number
  siteId: number
  date: string | Date
  src: string
  region: string | null
  callNumber: number
  class: string | null
  projectTitle: string
  advChannelName: string
  billsec: number
  comment: string | null
  redirectNumber: string | null
  source: string
}

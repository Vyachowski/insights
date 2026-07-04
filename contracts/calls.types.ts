export interface CallImport {
  id: number
  siteId: number
  date: string
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

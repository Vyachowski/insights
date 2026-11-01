export const sumAmounts = (rows: { amount: number }[]) =>
  rows.reduce((sum, row) => sum + row.amount, 0)

export const totalLeads = (metric: { leadsYandex: number, leadsGoogle: number, leadsOther: number }) =>
  metric.leadsYandex + metric.leadsGoogle + metric.leadsOther

export const formatNumber = (num: number) =>
  new Intl.NumberFormat('ru-RU').format(num)

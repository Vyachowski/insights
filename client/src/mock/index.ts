export const weeklyData = {
  profit: 35000,
  revenue: 120000,
  expenses: 85000,
  profitChange: 5,
};

export const monthlyComparison = {
  currentMonth: 140000,
  lastYear: 110000,
  change: 27,
};

export const yearlyTrendData = [
  { week: "Нед 1", current: 28000, previous: 22000 },
  { week: "Нед 2", current: 31000, previous: 25000 },
  { week: "Нед 3", current: 29000, previous: 23000 },
  { week: "Нед 4", current: 33000, previous: 26000 },
  { week: "Нед 5", current: 35000, previous: 28000 },
  { week: "Нед 6", current: 38000, previous: 30000 },
  { week: "Нед 7", current: 36000, previous: 29000 },
  { week: "Нед 8", current: 40000, previous: 31000 },
  { week: "Нед 9", current: 42000, previous: 33000 },
  { week: "Нед 10", current: 39000, previous: 32000 },
  { week: "Нед 11", current: 43000, previous: 34000 },
  { week: "Нед 12", current: 45000, previous: 36000 },
];

export const citiesData: Record<
  number,
  Array<{ city: string; profit: number }>
> = {
  2026: [
    { city: "Москва", profit: 45000 },
    { city: "Санкт-Петербург", profit: 32000 },
    { city: "Казань", profit: 18000 },
    { city: "Новосибирск", profit: 15000 },
    { city: "Екатеринбург", profit: 12000 },
  ],
  2025: [
    { city: "Москва", profit: 38000 },
    { city: "Санкт-Петербург", profit: 28000 },
    { city: "Казань", profit: 15000 },
    { city: "Новосибирск", profit: 13000 },
    { city: "Екатеринбург", profit: 10000 },
  ],
};

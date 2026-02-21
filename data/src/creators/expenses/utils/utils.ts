export const getMonths = (start: Date, end: Date) => {
  const result: Date[] = [];
  const d = new Date(start.getFullYear(), start.getMonth(), 1);

  while (d <= end) {
    result.push(new Date(d));
    d.setMonth(d.getMonth() + 1);
  }

  return result;
};

export const calcTelephonyAmount = (date: Date) => {
  if (date >= new Date("2025-12-01")) return 870;
  if (date >= new Date("2024-10-23")) return 480;
  return 300;
};

export const calcHostingAmount = (date: Date) =>
  date >= new Date("2025-12-01") ? 370 : 300;

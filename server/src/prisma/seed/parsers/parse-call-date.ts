export const parseCallDate = (str: string) => {
  const [datePart, timePart] = str.split(' ');
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split('.').map(Number);
  if (!year || !month || !day) return null;

  const [hour, minute] = timePart.split(':').map(Number);

  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day, hour, minute);
};

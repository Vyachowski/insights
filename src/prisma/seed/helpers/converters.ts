export const convertDurationToSeconds = (str: string): number | null => {
  if (!str) return null;
  const [minutes, seconds] = str.split(':').map(Number);
  if (!minutes || isNaN(minutes) || !seconds || isNaN(seconds)) return null;
  return minutes * 60 + seconds;
};

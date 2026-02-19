import dayjs from "dayjs";

interface DateChunk {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

/**
 * Split date range into chunks of N months
 *
 * Example:
 * splitDateRange('2025-01-01', '2025-06-30', 2)
 * → [
 *     { start: '2025-01-01', end: '2025-02-28' },
 *     { start: '2025-03-01', end: '2025-04-30' },
 *     { start: '2025-05-01', end: '2025-06-30' }
 *   ]
 */
export function splitDateRangeIntoChunks(
  startDate: string,
  endDate: string,
  chunkMonths: number,
): DateChunk[] {
  const chunks: DateChunk[] = [];

  let currentStart = dayjs(startDate);
  const end = dayjs(endDate);

  while (currentStart.isBefore(end) || currentStart.isSame(end, "day")) {
    // Calculate chunk end (N months later - 1 day)
    const chunkEnd = currentStart.add(chunkMonths, "month").subtract(1, "day");

    // Use the earlier of chunk end or final end date
    const effectiveEnd = chunkEnd.isAfter(end) ? end : chunkEnd;

    chunks.push({
      start: currentStart.format("YYYY-MM-DD"),
      end: effectiveEnd.format("YYYY-MM-DD"),
    });

    // Move to next chunk
    currentStart = effectiveEnd.add(1, "day");
  }

  return chunks;
}

/**
 * Format date range for logging
 */
export function formatDateRange(chunk: DateChunk): string {
  return `${chunk.start} to ${chunk.end}`;
}

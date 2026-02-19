import { convertDurationToSeconds } from "../../utils/converters";
import { parseCallDate } from "../../utils/parsers";
import type { CSVCallRow, CallRaw } from "./calls-raw-schema";

/**
 * Map CSV row to CallRaw format
 * Returns null if required data is missing
 */
export function mapCSVRowToCallRaw(
  row: CSVCallRow,
  siteId: number,
  importedAt: Date,
): CallRaw | null {
  // Parse date
  const dateTime = parseCallDate(row["Дата"]);
  if (!dateTime) {
    console.warn(`Invalid date format: ${row["Дата"]}`);
    return null;
  }

  // Validate required fields
  if (!row["Кто звонил"] || !row["Проект"] || !row["Куда звонил"]) {
    console.warn("Missing required fields in CSV row:", row);
    return null;
  }

  // Parse call number
  const callNumber = parseInt(row["№"], 10);
  if (isNaN(callNumber)) {
    console.warn(`Invalid call number: ${row["№"]}`);
    return null;
  }

  // Parse duration (billsec)
  const billsec = convertDurationToSeconds(row["Запись"] || "") ?? 0;

  return {
    siteId: siteId,
    date: dateTime.toISOString(),
    src: row["Кто звонил"],
    region: row["Откуда"] || null,
    callNumber: callNumber,
    class: row["Класс"] || null,
    projectTitle: row["Проект"],
    advChannelName: row["Куда звонил"],
    billsec,
    comment: row["Комментарий"] || null,
    redirectNumber: row["Вызов завершен"] || null,
    source: "csv" as const,
    importedAt: importedAt.toISOString(),
  };
}

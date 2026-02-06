import { convertDurationToSeconds } from "../data/utils/converters";
import { parseCallDate } from "../utils/parsers";
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
    site_id: siteId,
    date: dateTime.toISOString(),
    src: row["Кто звонил"],
    region: row["Откуда"] || null,
    call_number: callNumber,
    class: row["Класс"] || null,
    project_title: row["Проект"],
    adv_channel_name: row["Куда звонил"],
    billsec,
    comment: row["Комментарий"] || null,
    redirect_number: row["Вызов завершен"] || null,
    source: "csv" as const,
    imported_at: importedAt.toISOString(),
  };
}

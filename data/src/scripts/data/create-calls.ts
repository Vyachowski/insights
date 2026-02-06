import fs from "fs/promises";
import config from "../../config/config";
import path from "path";
import { parseCSV } from "./utils/parsers";
import { normalizeCallData } from "./utils/normalizers";
import type { City } from "./utils/validators";

export async function createCallsCSV(cities: City[]) {
  const callsData = parseCSV(config.paths.input.calls);

  const normalizedData = normalizeCallData(callsData, cities);

  const filePath = config.paths.output.calls;
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const headers = [
    "city_id",
    "date_time",
    "caller_number",
    "region",
    "call_order",
    "class",
    "number_name",
    "project",
    "duration_in_sec",
    "comment",
    "redirect_number",
  ];

  const lines = [headers.join(",")];

  normalizedData.forEach((row) => {
    if (row) {
      const line = [
        row.city_id,
        row.date_time.toISOString(),
        `"${row.caller_number || ""}"`,
        `"${row.region || ""}"`,
        row.call_order,
        `"${row.class || ""}"`,
        `"${row.number_name || ""}"`,
        `"${row.project || ""}"`,
        row.duration_in_sec ?? 0,
        `"${row.comment || ""}"`,
        `"${row.redirect_number || ""}"`,
      ].join(",");

      lines.push(line);
    }
  });

  await fs.writeFile(filePath, lines.join("\n"));
}

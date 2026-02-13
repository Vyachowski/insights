import fs from "fs/promises";
import config from "../config/config";
import { createResultMessage } from "./utils/create-result-mesage";

enum ExpenseType {
  Hosting = "hosting",
  Telephony = "telephony",
}

async function readCityIds(): Promise<number[]> {
  const content = await fs.readFile(config.paths.output.cities, "utf-8");

  const [, ...lines] = content.split("\n");

  return lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(",")[0])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
}

const getMonths = (start: Date, end: Date) => {
  const result: Date[] = [];
  const d = new Date(start.getFullYear(), start.getMonth(), 1);

  while (d <= end) {
    result.push(new Date(d));
    d.setMonth(d.getMonth() + 1);
  }

  return result;
};

const telephonyAmount = (date: Date) => {
  if (date >= new Date("2025-12-01")) return 870;
  if (date >= new Date("2024-10-23")) return 480;
  return 300;
};

const hostingAmount = (date: Date) =>
  date >= new Date("2025-12-01") ? 370 : 300;

export async function createExpensesCSV() {
  const filePath = config.paths.output.expenses;

  const cityIds = (await readCityIds()).filter((id) => id >= 1 && id <= 19);

  const months = getMonths(
    new Date(config.IMPORT_START_DATE),
    new Date(config.IMPORT_END_DATE),
  );

  const lines: string[] = [];
  lines.push("date,type,cityId,amount");

  for (const month of months) {
    // первый день месяца явно
    const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-01`;

    lines.push(`${date},${ExpenseType.Hosting},,${hostingAmount(month)}`);
    for (const city_id of cityIds) {
      lines.push(
        `${date},${ExpenseType.Telephony},${city_id},${telephonyAmount(month)}`,
      );
    }
  }

  await fs.writeFile(filePath, lines.join("\n"));

  return {
    data: lines,
    message: createResultMessage("Expenses", lines.length, filePath),
  };
}

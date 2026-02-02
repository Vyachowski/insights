import fs from "fs/promises";
import path from "path";
import appRootPath from "app-root-path";
import config from "../../config";
import { prisma } from "../../lib/prisma";

enum ExpenseType {
  Hosting = "hosting",
  Telephony = "telephony",
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

async function createExpensesCSV() {
  const fileName = `${config.IMPORT_START_DATE}_${config.IMPORT_END_DATE}_expenses.csv`;
  const filePath = path.resolve(appRootPath.path, "data", fileName);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.rm(filePath, { force: true });

  const cities = await prisma.call.findMany({
    distinct: ["city_id"],
    select: { city_id: true },
  });

  const months = getMonths(
    new Date(config.IMPORT_START_DATE),
    new Date(config.IMPORT_END_DATE)
  );

  const lines: string[] = [];
  lines.push("date,type,city_id,amount");

    for (const month of months) {
        // первый день месяца явно
        const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2,'0')}-01`;

        // hosting
        lines.push(
        `${date},${ExpenseType.Hosting},,${hostingAmount(month)}`
        );

        // telephony
        for (const { city_id } of cities) {
        lines.push(
            `${date},${ExpenseType.Telephony},${city_id},${telephonyAmount(month)}`
        );
        }
    }

  await fs.writeFile(filePath, lines.join("\n"));
}

await createExpensesCSV();

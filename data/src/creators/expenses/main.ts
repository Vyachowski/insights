import { calculateExpenses } from "./modules/calculate-expenses";
import { writeExpensesCSV } from "./modules/write-expenses-csv";
import type { City } from "@/types";
import { getMonths } from "./utils/utils";

export async function createExpensesCSV({ outputPath, cities, startDate, endDate }: { outputPath: string, cities: City[], startDate: string, endDate: string }) {
  const months = getMonths(
      new Date(startDate),
      new Date(endDate)
    );
  const cityIds = cities.map(({ id }) => id).filter((id) => id >= 1 && id <= 19)

  const lines = calculateExpenses(cityIds, months);

  return await writeExpensesCSV(lines, outputPath);
}

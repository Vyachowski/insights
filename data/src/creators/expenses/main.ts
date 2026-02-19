import { readData } from "./modules/read-data";
import { calculateExpenses } from "./modules/calculate-expenses";
import { writeExpensesCSV } from "./modules/write-expenses-csv";

export async function createExpensesCSV() {
  const { cityIds, months } = await readData();
  const lines = calculateExpenses(cityIds, months);
  return await writeExpensesCSV(lines);
}

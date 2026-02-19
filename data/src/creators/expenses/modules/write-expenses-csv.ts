import fs from 'fs/promises'
import config from "../../../config";
import { createResultMessage } from "../../utils/create-result-mesage";

export async function writeExpensesCSV(lines: string[]) {
  const filePath = config.paths.output.expenses;
  await fs.writeFile(filePath, lines.join("\n"));

  return {
    data: lines,
    message: createResultMessage("Expenses", lines.length, filePath),
  };
}

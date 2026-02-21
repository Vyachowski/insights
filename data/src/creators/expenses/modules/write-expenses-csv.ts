import fs from 'fs/promises'
import { createResultMessage } from "../../utils/create-result-mesage";

export async function writeExpensesCSV(lines: string[], outputPath: string) {
  await fs.writeFile(outputPath, lines.join("\n"));

  return {
    data: lines,
    message: createResultMessage("Expenses", lines.length, outputPath),
  };
}

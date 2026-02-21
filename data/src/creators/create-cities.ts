import fs from "fs/promises";

import { parseCSV } from "./utils/parsers";
import { validateCitiesData } from "./utils/validators";
import { createResultMessage } from "./utils/create-result-mesage";
import type { City } from "../types";

async function getAllCities(path: string): Promise<City[]> {
  const rows = parseCSV(path);
  return validateCitiesData(rows);
}

export async function createCitiesCSV({ inputPath, outputPath }: { inputPath: string, outputPath: string }) {
  const result = await getAllCities(inputPath);

  await fs.copyFile(inputPath, outputPath);

  return {
    message: createResultMessage("Cities", result.length, outputPath),
    data: result,
  };
}

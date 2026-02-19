import fs from "fs/promises";
import config from "../config";
import { parseCSV } from "./utils/parsers";
import { validateCitiesData } from "./utils/validators";
import { createResultMessage } from "./utils/create-result-mesage";
import type { City } from "../types";

async function getAllCities(path: string): Promise<City[]> {
  const rows = parseCSV(path);
  return validateCitiesData(rows);
}

export async function createCitiesCSV() {
  const importFilePath = config.paths.input.cities;
  const outputFilePath = config.paths.output.cities;

  const result = await getAllCities(importFilePath);

  await fs.copyFile(importFilePath, outputFilePath);

  return {
    message: createResultMessage("Cities", result.length, outputFilePath),
    data: result,
  };
}

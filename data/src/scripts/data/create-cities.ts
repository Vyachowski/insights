import fs from "fs/promises";
import config from "../../config/config";
import { parseCSV } from "./utils/parsers";
import { validateCitiesData, type City } from "./utils/validators";
import { createResultMessage } from "./utils/message/create-result-mesage";

async function getAllCities(path: string): Promise<City[]> {
  const rows = parseCSV(path);
  return validateCitiesData(rows);
}

export async function createCitiesCSV() {
  const importFilePath = config.paths.input.cities;
  const outputFilePath = config.paths.output.cities;

  const result = await getAllCities(outputFilePath);

  await fs.copyFile(importFilePath, outputFilePath);

  return {
    message: createResultMessage("Cities", result.length),
    data: result,
  };
}

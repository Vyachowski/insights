import fs from "fs/promises";
import config from "../../config/config";

export async function createCitiesCSV() {
  const importFilePath = config.paths.input.cities;
  const outputFilePath = config.paths.output.cities;

  await fs.copyFile(importFilePath, outputFilePath);
}

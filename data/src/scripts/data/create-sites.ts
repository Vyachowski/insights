import fs from "fs/promises";
import config from "../../config";

export async function createSitesCSV() {
  const importFilePath = config.paths.import.sites;
  const outputFilePath = config.paths.output.sites;

  await fs.copyFile(importFilePath, outputFilePath);
}

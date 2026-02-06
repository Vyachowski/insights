import fs from "fs/promises";
import config from "../config/config";
import { parseCSV } from "./utils/parsers";
import { createResultMessage } from "./utils/create-result-mesage";
import { validateSitesData } from "./utils/validators";
import type { Site } from "../types";

async function getAllSites(path: string): Promise<Site[]> {
  const rows = parseCSV(path);
  return validateSitesData(rows);
}

export async function createSitesCSV() {
  const importFilePath = config.paths.input.sites;
  const outputFilePath = config.paths.output.sites;

  const result = await getAllSites(importFilePath);

  await fs.copyFile(importFilePath, outputFilePath);

  return {
    message: createResultMessage("Sites", result.length, outputFilePath),
    data: result,
  };
}

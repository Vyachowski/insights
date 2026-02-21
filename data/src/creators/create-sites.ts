import fs from "fs/promises";
import { parseCSV } from "./utils/parsers";
import { createResultMessage } from "./utils/create-result-mesage";
import { validateSitesData } from "./utils/validators";
import type { Site } from "../types";

async function getAllSites(path: string): Promise<Site[]> {
  const rows = parseCSV(path);
  return validateSitesData(rows);
}

export async function createSitesCSV({ inputPath, outputPath }: { inputPath: string, outputPath: string }) {
  const result = await getAllSites(inputPath);

  await fs.copyFile(inputPath, outputPath);

  return {
    message: createResultMessage("Sites", result.length, outputPath),
    data: result,
  };
}

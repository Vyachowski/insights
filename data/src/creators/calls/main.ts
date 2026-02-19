import fs from "fs/promises";
import path from "path";
import config from "../../config/config";
import type { CSVCallRow } from "./modules/calls-raw-schema";

import { parseCSV } from "../utils/parsers";
import { createResultMessage } from "../utils/create-result-mesage";
import type { City } from "../../types";
import { buildCityToSiteMap, findSiteIdByProject } from "./modules/city-matcher";
import { generateCallsRawCSV } from "./modules/csv-formatter";
import { mapCSVRowToCallRaw } from "./modules/csv-to-raw-call";

interface CSVCreation {
  data: Record<string, any>[];
  message: string;
}

/**
 * Create calls_raw CSV file from input CSV data
 *
 * Process:
 * 1. Parse input CSV with call data
 * 2. Build city name → site_id mapping
 * 3. Transform each row to calls_raw format
 * 4. Generate output CSV file
 */
export async function createCallsCSV(cities: City[]): Promise<CSVCreation> {
  const importedAt = new Date();

  // Step 1: Parse input CSV
  const rawRows = parseCSV(config.paths.input.calls);
  console.log(`Parsed ${rawRows.length} rows from input CSV`);

  // Step 2: Build city mapping
  const cityToSiteMap = buildCityToSiteMap(cities);
  console.log(`Built mapping for ${cityToSiteMap.size} cities`);

  // Step 3: Transform rows
  const callsRaw = rawRows
    .map((row) => {
      const typedRow = row as unknown as CSVCallRow;

      // Find site_id by project name
      const siteId = findSiteIdByProject(typedRow["Проект"], cityToSiteMap);

      if (!siteId) {
        console.warn(`City not found for project: ${typedRow["Проект"]}`);
        return null;
      }

      // Map to CallRaw format
      return mapCSVRowToCallRaw(typedRow, siteId, importedAt);
    })
    .filter((call): call is NonNullable<typeof call> => call !== null);

  console.log(`Successfully transformed ${callsRaw.length} calls`);

  // Step 4: Generate and write CSV
  const csvContent = generateCallsRawCSV(callsRaw);
  const outputPath = config.paths.output.calls;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, csvContent, "utf-8");

  console.log(`✓ Calls CSV created: ${outputPath}`);
  console.log(`  Total calls: ${callsRaw.length}`);

  return {
    data: callsRaw,
    message: createResultMessage("Calls", callsRaw.length, outputPath),
  };
}

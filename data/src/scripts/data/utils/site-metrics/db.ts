import config from "../../../../config/config";
import { parseCSV } from "../parsers";

export interface Site {
  id: number;
  name: string;
  yandex_counter_id: string;
}

export async function getAllSites(): Promise<Site[]> {
  const rows = parseCSV(config.paths.output.sites);

  const sites: Site[] = rows
    .map((row) => {
      if (!row["id"] || !row["name"] || !row["yandex_counter_id"]) {
        return null;
      }

      return {
        id: Number(row["id"]),
        name: row["name"],
        yandex_counter_id: row["yandex_counter_id"],
      };
    })
    .filter(Boolean) as Site[];

  if (sites.length === 0) throw new Error("No sites found in CSV");

  return sites;
}

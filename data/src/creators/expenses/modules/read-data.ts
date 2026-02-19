import { readCityIds, getMonths } from "../utils/utils";
import config from "../../../config";

export async function readData() {
  const cityIds = (await readCityIds()).filter((id) => id >= 1 && id <= 19);

  const months = getMonths(
    new Date(config.IMPORT_START_DATE),
    new Date(config.IMPORT_END_DATE)
  );

  return { cityIds, months };
}

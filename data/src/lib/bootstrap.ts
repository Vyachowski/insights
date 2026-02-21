import { resolveSharedPaths } from "@shared/utils";
import getSharedConfig from "@shared/config";
import { defineRepoRootPath } from "@shared/utils";
import resolveInputPaths from "@/config";
import { removeFiles } from "./fs";

export default function bootstrap() {
  const repoRootPath = defineRepoRootPath();
  const { FILE_PREFIX, IMPORT_END_DATE: endDate, IMPORT_START_DATE: startDate } = getSharedConfig();
  const { filePaths: outputPaths, folderPath: outputDir } = resolveSharedPaths(repoRootPath, FILE_PREFIX);
  const inputPaths = resolveInputPaths(repoRootPath, FILE_PREFIX);

  return {
    inputPaths,
    outputPaths,
    outputDir,
    startDate,
    endDate,
    options: { cleanerFunc: removeFiles }
  };
}

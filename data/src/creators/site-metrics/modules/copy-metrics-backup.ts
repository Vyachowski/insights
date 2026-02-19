import fs from "fs/promises";
import config from "@/config";
import { createResultMessage } from "@/creators/utils/create-result-mesage";

export async function copyMetricsBackup() {
  const inputPath = config.paths.input.siteMetricsBackup;
  const outputPath = config.paths.output.siteMetrics;

  await fs.copyFile(inputPath, outputPath);

  return {
    data: null,
    message: createResultMessage("Site Metrics", 22_781, outputPath),
  };
}

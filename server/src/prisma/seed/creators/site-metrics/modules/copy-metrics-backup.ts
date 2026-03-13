import fs from 'fs/promises';
import { createResultMessage } from '../../utils/create-result-message';

export async function copyMetricsBackup(inputPath: string, outputPath: string) {
  await fs.copyFile(inputPath, outputPath);

  return {
    data: null,
    message: createResultMessage('Site Metrics', 22_781, outputPath),
  };
}

import fs from 'fs/promises';

export async function checkFilesExistence(paths: string[]): Promise<void> {
  await Promise.all(paths.map((p) => fs.access(p)));
}

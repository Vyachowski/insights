import fs from 'fs/promises';

export const checkFilesExistence = async (paths: string[]): Promise<void> => {
  await Promise.all(paths.map(p => fs.access(p)));
};
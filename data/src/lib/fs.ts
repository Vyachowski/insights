import fs from 'fs/promises'
import path from 'path';

export async function removeFiles(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map((entry) => fs.rm(path.join(dir, entry.name))),
  );
}

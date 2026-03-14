import seed from './main';
import { PREPARED_FILES_PATHS, RAW_FILES_PATHS } from './config';
import { prisma } from './connector';

seed(PREPARED_FILES_PATHS, RAW_FILES_PATHS)
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

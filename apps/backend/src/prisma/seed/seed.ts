import seed from './main';
import { PREPARED_FILES_PATHS, RAW_FILES_PATHS } from './config';

seed(PREPARED_FILES_PATHS, RAW_FILES_PATHS).catch((e) => {
  console.error(e);

  process.exit(1);
});

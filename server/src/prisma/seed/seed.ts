import seed from './modules/main';
import getSharedConfig from '@shared/config';
import { defineRepoRootPath, resolveSharedPaths } from '@shared/utils';

const rootPath = defineRepoRootPath();
const { FILE_PREFIX } = getSharedConfig();
const { filePaths: paths } = resolveSharedPaths(rootPath, FILE_PREFIX);

seed(paths).catch((e) => {
  console.error(e);
  process.exit(1);
});

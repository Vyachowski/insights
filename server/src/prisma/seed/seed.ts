import seed from './modules/main';
import getSharedConfig from '@shared/config';
import { defineRepoRootPath, resolveSharedPaths } from '@shared/utils';

const { FILE_PREFIX } = getSharedConfig();
const rootPath = defineRepoRootPath();
const { filePaths: paths } = resolveSharedPaths(rootPath, FILE_PREFIX);

seed(paths).catch((e) => {
  console.error(e);
  process.exit(1);
});

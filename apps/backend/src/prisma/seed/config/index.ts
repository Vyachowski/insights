import { fromSrcRoot } from '@/lib';
import path, { join } from 'path';

const FOLDER_PATH = fromSrcRoot('prisma/seed/data');
const PREPARED_FOLDER_PATH = join(FOLDER_PATH, 'prepared');

export const PREPARED_FILES_PATHS = Object.freeze({
  cities: path.resolve(PREPARED_FOLDER_PATH, 'cities.csv'),
  sites: path.resolve(PREPARED_FOLDER_PATH, 'sites.csv'),
});

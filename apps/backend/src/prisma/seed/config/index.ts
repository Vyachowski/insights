import { fromSrcRoot } from '@/lib';
import path, { join } from 'path';

export const FOLDER_PATH = fromSrcRoot('prisma/seed/data');
export const PREPARED_FOLDER_PATH = join(FOLDER_PATH, 'prepared');

export const PREPARED_FILES_PATHS = Object.freeze({
  cities: path.resolve(PREPARED_FOLDER_PATH, 'cities.csv'),
  sites: path.resolve(PREPARED_FOLDER_PATH, 'sites.csv'),
});

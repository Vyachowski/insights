import appRootPath from 'app-root-path';
import path from 'path';

const dataFolderPath = path.resolve(appRootPath.path, 'data')
const importFolderPath = path.resolve(appRootPath.path, 'import')

const IMPORT_START_DATE = '2021-05-01'
const IMPORT_END_DATE = '2025-12-31'
const FILE_SEPARATOR = '_'

const FILE_PREFIX = `${IMPORT_START_DATE}${FILE_SEPARATOR}${IMPORT_END_DATE}${FILE_SEPARATOR}`

const BATCH_SIZE = 'month'
const paths = {
        import: {
            cities: path.resolve(importFolderPath, `${FILE_PREFIX}cities.csv`),
            sites: path.resolve(importFolderPath, `${FILE_PREFIX}sites.csv`),
            calls: path.resolve(importFolderPath, `${FILE_PREFIX}calls.csv`),
            revenue: path.resolve(importFolderPath, `${FILE_PREFIX}revenue.json`),
            revenueFolder: path.resolve(importFolderPath, `${FILE_PREFIX}revenue-tg`),
        },
        output: {
            cities: path.resolve(dataFolderPath, `${FILE_PREFIX}cities.csv`),
            sites: path.resolve(dataFolderPath, `${FILE_PREFIX}sites.csv`),
            calls: path.resolve(dataFolderPath, `${FILE_PREFIX}calls.csv`),
            revenue: path.resolve(dataFolderPath, `${FILE_PREFIX}revenue.csv`),
            siteMetrics: path.resolve(dataFolderPath, `${FILE_PREFIX}site-metrics.csv`),
            expenses: path.resolve(dataFolderPath, `${FILE_PREFIX}expenses.csv`),
        },
    }

export default {
    IMPORT_START_DATE,
    IMPORT_END_DATE,
    BATCH_SIZE,
    paths
}

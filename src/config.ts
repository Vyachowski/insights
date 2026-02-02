import appRootPath from 'app-root-path';
import path from 'path';

const dataFolderPath = path.resolve(appRootPath.path, 'data')
const importFolderPath = path.resolve(appRootPath.path, 'import')

export default {
    START_DATE: '2021-05-01',
    END_DATE: '2025-12-31',
    BATCH_SIZE: 'month',
    paths: {
        import: {
            cities: path.resolve(importFolderPath, 'cities.csv'),
            sites: path.resolve(importFolderPath, 'sites.csv'),
            calls: path.resolve(importFolderPath, 'calls.csv'),
            revenue: path.resolve(importFolderPath, 'revenue.json'),
            revenueFolder: path.resolve(importFolderPath, 'revenue-tg'),
        },
        output: {
            cities: path.resolve(dataFolderPath, 'cities.csv'),
            sites: path.resolve(dataFolderPath, 'sites.csv'),
            calls: path.resolve(dataFolderPath, 'calls.csv'),
            revenue: path.resolve(dataFolderPath, 'revenue.csv'),
            siteMetrics: path.resolve(dataFolderPath, 'site-metrics.csv'),
            expenses: path.resolve(dataFolderPath, '2021-05-01_2025-12-31_expenses.csv'),
        },
    }
}
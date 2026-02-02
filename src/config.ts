import appRootPath from 'app-root-path';
import path from 'path';

const dataFolderPath = path.resolve(appRootPath.path, 'data')

export default {
    START_DATE: '2021-05-01',
    END_DATE: '2025-12-31',
    BATCH_SIZE: 'month',
    dataFilePaths: {
        import: {
            cities: path.resolve(dataFolderPath, 'cities/cities.csv'),
            sites: path.resolve(dataFolderPath, 'sites/sites.csv'),
            calls: path.resolve(dataFolderPath, 'calls/calls.csv'),
            revenue: path.resolve(dataFolderPath, 'revenue/revenue.csv'),
            siteMetrics: path.resolve(dataFolderPath, 'site-metrics/site-metrics.csv'),
            expenses: path.resolve(dataFolderPath, 'expenses/2021-05-01_2025-12-31_expenses.csv'),
        },
        rawData: {
            calls: path.resolve(dataFolderPath, 'calls/import/calls.csv'),
            revenueFolder: path.resolve(dataFolderPath, 'revenue/import'),
        },
    }
}
import appRootPath from 'app-root-path';
import path from 'path';

export default {
    START_DATE: '2021-05-01',
    END_DATE: '2025-12-31',
    BATCH_SIZE: 'month',
    paths: {
        cities: path.resolve(appRootPath.path, 'data/cities/cities.csv'),
        sites: path.resolve(appRootPath.path, 'data/sites/sites.csv'),
        calls: path.resolve(appRootPath.path, 'data/calls/calls.csv'),
        revenue: path.resolve(appRootPath.path, 'data/revenue/revenue.csv'),
        siteMetrics: path.resolve(appRootPath.path, 'data/site-metrics/site-metrics.csv'),
    }
}
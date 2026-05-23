import { checkDatabaseConnection } from './checkers';
import { formatImportResult } from './helpers';
import { importCities, importSites, importUsers } from './orchestrators';

type Seed = (paths: { cities: string; sites: string }) => Promise<void>;

const seed: Seed = async (paths) => {
  await checkDatabaseConnection();
  console.log('✅ Database connection succesfully established.');

  const usersResult = await importUsers();
  console.log(formatImportResult('Users', usersResult));

  const citiesResult = await importCities(paths.cities);
  console.log(formatImportResult('Cities', citiesResult));

  const sitesResult = await importSites(paths.sites);
  console.log(formatImportResult('Sites', sitesResult));
};

export default seed;

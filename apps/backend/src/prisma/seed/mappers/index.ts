import { normalizeCalls } from '../normalizers';
import { importSites } from '../orchestrators';

export function mapCallsToDomain(
  calls: ReturnType<typeof normalizeCalls>,
  sitesWithCityName: Awaited<ReturnType<typeof importSites>>,
) {
  return calls.map((call) => {
    const site = sitesWithCityName.find(
      (site) => site.city.name.toLowerCase() === call.projectTitle,
    );
    const siteId = site ? site.id : null;

    return {
      ...call,
      siteId: siteId,
    };
  });
}

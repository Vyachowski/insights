import { normalizeCalls } from '../normalizers';
import { SiteWithCity } from '../types';

export function mapCallsToDomain(
  calls: ReturnType<typeof normalizeCalls>,
  sitesWithCityName: SiteWithCity[],
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

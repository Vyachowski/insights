import { City } from '@/prisma/generated/prisma/client';
import { normalizeCalls } from '../normalizers';

export function mapCallsToDomain(
  calls: ReturnType<typeof normalizeCalls>,
  cities: City[],
) {
  return calls.map((call) => {
    // NOTE: It will work only when in initial data site.id is the same as city.id
    const site = cities.find(
      (city) => city.name.toLowerCase() === call.projectTitle,
    );
    const siteId = site ? site.id : '';

    return {
      ...call,
      siteId: siteId,
    };
  });
}

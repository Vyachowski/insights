import { validateCitiesData, validateSitesData } from '../validators';
import { createUsers } from '../creators';
import { prisma } from '../connector';
import { ImportResult, SiteWithCity } from '../types';

export async function seedUsers(
  users: ReturnType<typeof createUsers>,
): Promise<ImportResult> {
  const data = [users.admin, users.user];
  const total = data.length;

  const result = await prisma.user.createMany({
    data: data,
    skipDuplicates: true,
  });

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data: null,
  };
}

export async function seedCities(
  cities: ReturnType<typeof validateCitiesData>,
): Promise<ImportResult> {
  const total = Array.isArray(cities.data) ? cities.data.length : 1;
  const result = await prisma.city.createMany(cities);

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data: null,
  };
}

export async function seedSites(
  sites: ReturnType<typeof validateSitesData>,
): Promise<ImportResult<SiteWithCity[]>> {
  const total = Array.isArray(sites.data) ? sites.data.length : 1;
  const result = await prisma.site.createMany(sites);

  const data = await prisma.site.findMany({
    select: {
      id: true,
      city: { select: { name: true } },
    },
  });

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data,
  };
}

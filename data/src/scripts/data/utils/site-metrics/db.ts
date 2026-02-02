import type { Site } from "../../../../generated/prisma";
import { prisma } from "../../../../lib/prisma";

export async function getAllSites(): Promise<Site[]> {
  const sites = await prisma.site.findMany();
  if (sites.length === 0) throw new Error('No sites found in DB');

  sites.forEach(site => {
    if (!site.yandex_counter_id) {
      throw new Error(`Site ${site.id} (${site.name}) has no yandex_counter_id`);
    }
  });

  return sites;
}

export { prisma };
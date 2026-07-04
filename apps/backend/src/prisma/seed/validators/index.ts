import {
  CityCreateManySchema,
  SiteCreateManySchema,
} from '../../generated/schemas';
import { normalizeCities, normalizeSites } from '../normalizers';

export function validateCitiesData(
  citiesData: ReturnType<typeof normalizeCities>,
) {
  if (citiesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return CityCreateManySchema.parse({
    data: citiesData,
    skipDuplicates: true,
  });
}

export function validateSitesData(
  sitesData: ReturnType<typeof normalizeSites>,
) {
  if (sitesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return SiteCreateManySchema.parse({
    data: sitesData,
    skipDuplicates: true,
  });
}

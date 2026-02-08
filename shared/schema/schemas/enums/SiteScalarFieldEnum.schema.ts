import * as z from 'zod';

export const SiteScalarFieldEnumSchema = z.enum(['id', 'city_id', 'name', 'url', 'yandex_counter_id', 'google_counter_id', 'yandex_tag_manager_id', 'google_tag_manager_id', 'createdAt', 'updatedAt'])

export type SiteScalarFieldEnum = z.infer<typeof SiteScalarFieldEnumSchema>;
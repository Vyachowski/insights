import * as z from 'zod';

export const SiteScalarFieldEnumSchema = z.enum(['id', 'cityId', 'name', 'group', 'url', 'yandexCounterId', 'googleCounterId', 'yandexTagManagerId', 'googleTagManagerId', 'createdAt', 'updatedAt'])

export type SiteScalarFieldEnum = z.infer<typeof SiteScalarFieldEnumSchema>;
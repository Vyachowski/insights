import * as z from 'zod';

export const CityScalarFieldEnumSchema = z.enum(['id', 'code', 'slug', 'name', 'population', 'createdAt', 'updatedAt'])

export type CityScalarFieldEnum = z.infer<typeof CityScalarFieldEnumSchema>;
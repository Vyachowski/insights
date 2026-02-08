import * as z from 'zod';

export const RevenueScalarFieldEnumSchema = z.enum(['id', 'city_id', 'date', 'amount', 'createdAt', 'updatedAt'])

export type RevenueScalarFieldEnum = z.infer<typeof RevenueScalarFieldEnumSchema>;
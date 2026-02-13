import * as z from 'zod';

export const RevenueScalarFieldEnumSchema = z.enum(['id', 'cityId', 'date', 'amount', 'createdAt', 'updatedAt'])

export type RevenueScalarFieldEnum = z.infer<typeof RevenueScalarFieldEnumSchema>;
import * as z from 'zod';

export const ExpenseScalarFieldEnumSchema = z.enum(['id', 'cityId', 'date', 'amount', 'type', 'comment', 'createdAt', 'updatedAt'])

export type ExpenseScalarFieldEnum = z.infer<typeof ExpenseScalarFieldEnumSchema>;
import * as z from 'zod';
// prettier-ignore
export const ExpenseModelSchema = z.object({
    id: z.number().int(),
    cityId: z.number().int().nullable(),
    date: z.date(),
    amount: z.number(),
    type: z.string(),
    comment: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown().nullable()
}).strict();

export type ExpensePureType = z.infer<typeof ExpenseModelSchema>;

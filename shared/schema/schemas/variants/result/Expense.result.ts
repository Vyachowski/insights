import * as z from 'zod';
// prettier-ignore
export const ExpenseResultSchema = z.object({
    id: z.number().int(),
    city_id: z.number().int().nullable(),
    date: z.date(),
    amount: z.number(),
    type: z.string(),
    comment: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown().nullable()
}).strict();

export type ExpenseResultType = z.infer<typeof ExpenseResultSchema>;

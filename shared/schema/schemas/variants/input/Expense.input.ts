import * as z from 'zod';
// prettier-ignore
export const ExpenseInputSchema = z.object({
    id: z.number().int(),
    cityId: z.number().int().optional().nullable(),
    date: z.date(),
    amount: z.number(),
    type: z.string(),
    comment: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown().optional().nullable()
}).strict();

export type ExpenseInputType = z.infer<typeof ExpenseInputSchema>;

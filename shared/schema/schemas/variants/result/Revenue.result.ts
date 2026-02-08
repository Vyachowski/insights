import * as z from 'zod';
// prettier-ignore
export const RevenueResultSchema = z.object({
    id: z.number().int(),
    city_id: z.number().int().nullable(),
    date: z.date(),
    amount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown().nullable()
}).strict();

export type RevenueResultType = z.infer<typeof RevenueResultSchema>;

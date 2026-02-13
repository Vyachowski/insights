import * as z from 'zod';
// prettier-ignore
export const RevenueInputSchema = z.object({
    id: z.number().int(),
    cityId: z.number().int().optional().nullable(),
    date: z.date(),
    amount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown().optional().nullable()
}).strict();

export type RevenueInputType = z.infer<typeof RevenueInputSchema>;

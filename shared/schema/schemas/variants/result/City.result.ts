import * as z from 'zod';
// prettier-ignore
export const CityResultSchema = z.object({
    id: z.number().int(),
    code: z.string(),
    slug: z.string(),
    name: z.string(),
    population: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    sites: z.array(z.unknown()),
    revenues: z.array(z.unknown()),
    expenses: z.array(z.unknown())
}).strict();

export type CityResultType = z.infer<typeof CityResultSchema>;

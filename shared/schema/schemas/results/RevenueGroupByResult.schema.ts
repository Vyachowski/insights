import * as z from 'zod';
export const RevenueGroupByResultSchema = z.array(z.object({
  id: z.number().int(),
  cityId: z.number().int(),
  date: z.date(),
  amount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    cityId: z.number(),
    date: z.number(),
    amount: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    city: z.number()
  }).optional(),
  _sum: z.object({
    id: z.number().nullable(),
    cityId: z.number().nullable(),
    amount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    id: z.number().nullable(),
    cityId: z.number().nullable(),
    amount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.number().int().nullable(),
    cityId: z.number().int().nullable(),
    date: z.date().nullable(),
    amount: z.number().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.number().int().nullable(),
    cityId: z.number().int().nullable(),
    date: z.date().nullable(),
    amount: z.number().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));
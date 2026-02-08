import * as z from 'zod';
export const ExpenseGroupByResultSchema = z.array(z.object({
  id: z.number().int(),
  city_id: z.number().int(),
  date: z.date(),
  amount: z.number(),
  type: z.string(),
  comment: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    city_id: z.number(),
    date: z.number(),
    amount: z.number(),
    type: z.number(),
    comment: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    city: z.number()
  }).optional(),
  _sum: z.object({
    id: z.number().nullable(),
    city_id: z.number().nullable(),
    amount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    id: z.number().nullable(),
    city_id: z.number().nullable(),
    amount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.number().int().nullable(),
    city_id: z.number().int().nullable(),
    date: z.date().nullable(),
    amount: z.number().nullable(),
    type: z.string().nullable(),
    comment: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.number().int().nullable(),
    city_id: z.number().int().nullable(),
    date: z.date().nullable(),
    amount: z.number().nullable(),
    type: z.string().nullable(),
    comment: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));
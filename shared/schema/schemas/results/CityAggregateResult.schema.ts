import * as z from 'zod';
export const CityAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    code: z.number(),
    slug: z.number(),
    name: z.number(),
    population: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    sites: z.number(),
    revenues: z.number(),
    expenses: z.number()
  }).optional(),
  _sum: z.object({
    id: z.number().nullable(),
    population: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    id: z.number().nullable(),
    population: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.number().int().nullable(),
    code: z.string().nullable(),
    slug: z.string().nullable(),
    name: z.string().nullable(),
    population: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.number().int().nullable(),
    code: z.string().nullable(),
    slug: z.string().nullable(),
    name: z.string().nullable(),
    population: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});
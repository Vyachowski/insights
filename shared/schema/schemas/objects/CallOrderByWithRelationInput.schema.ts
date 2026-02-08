import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SiteOrderByWithRelationInputObjectSchema as SiteOrderByWithRelationInputObjectSchema } from './SiteOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  site_id: SortOrderSchema.optional(),
  gudok_id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  project_title: SortOrderSchema.optional(),
  dst: SortOrderSchema.optional(),
  adv_channel_id: SortOrderSchema.optional(),
  adv_channel_name: SortOrderSchema.optional(),
  src: SortOrderSchema.optional(),
  duration: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  callstatus: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  region: SortOrderSchema.optional(),
  call_number: SortOrderSchema.optional(),
  audio: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  site: z.lazy(() => SiteOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const CallOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CallOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CallOrderByWithRelationInput>;
export const CallOrderByWithRelationInputObjectZodSchema = makeSchema();

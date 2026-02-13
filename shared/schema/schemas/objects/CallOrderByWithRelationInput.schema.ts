import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SiteOrderByWithRelationInputObjectSchema as SiteOrderByWithRelationInputObjectSchema } from './SiteOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  siteId: SortOrderSchema.optional(),
  gudokId: SortOrderSchema.optional(),
  projectId: SortOrderSchema.optional(),
  projectTitle: SortOrderSchema.optional(),
  dst: SortOrderSchema.optional(),
  advChannelId: SortOrderSchema.optional(),
  advChannelName: SortOrderSchema.optional(),
  src: SortOrderSchema.optional(),
  duration: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  callstatus: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  region: SortOrderSchema.optional(),
  callNumber: SortOrderSchema.optional(),
  audio: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  site: z.lazy(() => SiteOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const CallOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CallOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CallOrderByWithRelationInput>;
export const CallOrderByWithRelationInputObjectZodSchema = makeSchema();

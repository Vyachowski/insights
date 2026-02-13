import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SiteOrderByWithRelationInputObjectSchema as SiteOrderByWithRelationInputObjectSchema } from './SiteOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  siteId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  src: SortOrderSchema.optional(),
  region: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  callNumber: SortOrderSchema.optional(),
  class: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  projectTitle: SortOrderSchema.optional(),
  advChannelName: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  comment: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  redirectNumber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source: SortOrderSchema.optional(),
  importedAt: SortOrderSchema.optional(),
  site: z.lazy(() => SiteOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const CallImportOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CallImportOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportOrderByWithRelationInput>;
export const CallImportOrderByWithRelationInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateNestedOneWithoutCallsInputObjectSchema as SiteCreateNestedOneWithoutCallsInputObjectSchema } from './SiteCreateNestedOneWithoutCallsInput.schema'

const makeSchema = () => z.object({
  gudokId: z.number().int(),
  projectId: z.number().int(),
  projectTitle: z.string(),
  dst: z.string(),
  advChannelId: z.string(),
  advChannelName: z.string(),
  src: z.string(),
  duration: z.number().int(),
  billsec: z.number().int(),
  callstatus: z.string(),
  date: z.coerce.date(),
  region: z.string(),
  callNumber: z.number().int(),
  audio: z.string(),
  source: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  site: z.lazy(() => SiteCreateNestedOneWithoutCallsInputObjectSchema)
}).strict();
export const CallCreateInputObjectSchema: z.ZodType<Prisma.CallCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallCreateInput>;
export const CallCreateInputObjectZodSchema = makeSchema();

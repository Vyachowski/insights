import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteCreateWithoutCallsRawInputObjectSchema as SiteCreateWithoutCallsRawInputObjectSchema } from './SiteCreateWithoutCallsRawInput.schema';
import { SiteUncheckedCreateWithoutCallsRawInputObjectSchema as SiteUncheckedCreateWithoutCallsRawInputObjectSchema } from './SiteUncheckedCreateWithoutCallsRawInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SiteCreateWithoutCallsRawInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsRawInputObjectSchema)])
}).strict();
export const SiteCreateOrConnectWithoutCallsRawInputObjectSchema: z.ZodType<Prisma.SiteCreateOrConnectWithoutCallsRawInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateOrConnectWithoutCallsRawInput>;
export const SiteCreateOrConnectWithoutCallsRawInputObjectZodSchema = makeSchema();

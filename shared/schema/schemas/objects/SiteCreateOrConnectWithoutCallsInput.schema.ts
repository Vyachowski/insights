import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteCreateWithoutCallsInputObjectSchema as SiteCreateWithoutCallsInputObjectSchema } from './SiteCreateWithoutCallsInput.schema';
import { SiteUncheckedCreateWithoutCallsInputObjectSchema as SiteUncheckedCreateWithoutCallsInputObjectSchema } from './SiteUncheckedCreateWithoutCallsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SiteCreateWithoutCallsInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsInputObjectSchema)])
}).strict();
export const SiteCreateOrConnectWithoutCallsInputObjectSchema: z.ZodType<Prisma.SiteCreateOrConnectWithoutCallsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateOrConnectWithoutCallsInput>;
export const SiteCreateOrConnectWithoutCallsInputObjectZodSchema = makeSchema();

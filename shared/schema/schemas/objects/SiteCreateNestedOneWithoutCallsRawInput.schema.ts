import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutCallsRawInputObjectSchema as SiteCreateWithoutCallsRawInputObjectSchema } from './SiteCreateWithoutCallsRawInput.schema';
import { SiteUncheckedCreateWithoutCallsRawInputObjectSchema as SiteUncheckedCreateWithoutCallsRawInputObjectSchema } from './SiteUncheckedCreateWithoutCallsRawInput.schema';
import { SiteCreateOrConnectWithoutCallsRawInputObjectSchema as SiteCreateOrConnectWithoutCallsRawInputObjectSchema } from './SiteCreateOrConnectWithoutCallsRawInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutCallsRawInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsRawInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SiteCreateOrConnectWithoutCallsRawInputObjectSchema).optional(),
  connect: z.lazy(() => SiteWhereUniqueInputObjectSchema).optional()
}).strict();
export const SiteCreateNestedOneWithoutCallsRawInputObjectSchema: z.ZodType<Prisma.SiteCreateNestedOneWithoutCallsRawInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateNestedOneWithoutCallsRawInput>;
export const SiteCreateNestedOneWithoutCallsRawInputObjectZodSchema = makeSchema();

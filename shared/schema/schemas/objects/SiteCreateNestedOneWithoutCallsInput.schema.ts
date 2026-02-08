import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutCallsInputObjectSchema as SiteCreateWithoutCallsInputObjectSchema } from './SiteCreateWithoutCallsInput.schema';
import { SiteUncheckedCreateWithoutCallsInputObjectSchema as SiteUncheckedCreateWithoutCallsInputObjectSchema } from './SiteUncheckedCreateWithoutCallsInput.schema';
import { SiteCreateOrConnectWithoutCallsInputObjectSchema as SiteCreateOrConnectWithoutCallsInputObjectSchema } from './SiteCreateOrConnectWithoutCallsInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutCallsInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SiteCreateOrConnectWithoutCallsInputObjectSchema).optional(),
  connect: z.lazy(() => SiteWhereUniqueInputObjectSchema).optional()
}).strict();
export const SiteCreateNestedOneWithoutCallsInputObjectSchema: z.ZodType<Prisma.SiteCreateNestedOneWithoutCallsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateNestedOneWithoutCallsInput>;
export const SiteCreateNestedOneWithoutCallsInputObjectZodSchema = makeSchema();

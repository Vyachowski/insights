import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutCallsImportInputObjectSchema as SiteCreateWithoutCallsImportInputObjectSchema } from './SiteCreateWithoutCallsImportInput.schema';
import { SiteUncheckedCreateWithoutCallsImportInputObjectSchema as SiteUncheckedCreateWithoutCallsImportInputObjectSchema } from './SiteUncheckedCreateWithoutCallsImportInput.schema';
import { SiteCreateOrConnectWithoutCallsImportInputObjectSchema as SiteCreateOrConnectWithoutCallsImportInputObjectSchema } from './SiteCreateOrConnectWithoutCallsImportInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutCallsImportInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsImportInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SiteCreateOrConnectWithoutCallsImportInputObjectSchema).optional(),
  connect: z.lazy(() => SiteWhereUniqueInputObjectSchema).optional()
}).strict();
export const SiteCreateNestedOneWithoutCallsImportInputObjectSchema: z.ZodType<Prisma.SiteCreateNestedOneWithoutCallsImportInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateNestedOneWithoutCallsImportInput>;
export const SiteCreateNestedOneWithoutCallsImportInputObjectZodSchema = makeSchema();

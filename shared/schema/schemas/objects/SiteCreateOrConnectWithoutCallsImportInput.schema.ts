import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteCreateWithoutCallsImportInputObjectSchema as SiteCreateWithoutCallsImportInputObjectSchema } from './SiteCreateWithoutCallsImportInput.schema';
import { SiteUncheckedCreateWithoutCallsImportInputObjectSchema as SiteUncheckedCreateWithoutCallsImportInputObjectSchema } from './SiteUncheckedCreateWithoutCallsImportInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SiteCreateWithoutCallsImportInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsImportInputObjectSchema)])
}).strict();
export const SiteCreateOrConnectWithoutCallsImportInputObjectSchema: z.ZodType<Prisma.SiteCreateOrConnectWithoutCallsImportInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateOrConnectWithoutCallsImportInput>;
export const SiteCreateOrConnectWithoutCallsImportInputObjectZodSchema = makeSchema();

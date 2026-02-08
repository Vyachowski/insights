import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './CallWhereUniqueInput.schema';
import { CallUpdateWithoutSiteInputObjectSchema as CallUpdateWithoutSiteInputObjectSchema } from './CallUpdateWithoutSiteInput.schema';
import { CallUncheckedUpdateWithoutSiteInputObjectSchema as CallUncheckedUpdateWithoutSiteInputObjectSchema } from './CallUncheckedUpdateWithoutSiteInput.schema';
import { CallCreateWithoutSiteInputObjectSchema as CallCreateWithoutSiteInputObjectSchema } from './CallCreateWithoutSiteInput.schema';
import { CallUncheckedCreateWithoutSiteInputObjectSchema as CallUncheckedCreateWithoutSiteInputObjectSchema } from './CallUncheckedCreateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CallUpdateWithoutSiteInputObjectSchema), z.lazy(() => CallUncheckedUpdateWithoutSiteInputObjectSchema)]),
  create: z.union([z.lazy(() => CallCreateWithoutSiteInputObjectSchema), z.lazy(() => CallUncheckedCreateWithoutSiteInputObjectSchema)])
}).strict();
export const CallUpsertWithWhereUniqueWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutSiteInput>;
export const CallUpsertWithWhereUniqueWithoutSiteInputObjectZodSchema = makeSchema();

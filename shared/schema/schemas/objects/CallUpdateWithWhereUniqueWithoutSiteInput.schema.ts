import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './CallWhereUniqueInput.schema';
import { CallUpdateWithoutSiteInputObjectSchema as CallUpdateWithoutSiteInputObjectSchema } from './CallUpdateWithoutSiteInput.schema';
import { CallUncheckedUpdateWithoutSiteInputObjectSchema as CallUncheckedUpdateWithoutSiteInputObjectSchema } from './CallUncheckedUpdateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CallUpdateWithoutSiteInputObjectSchema), z.lazy(() => CallUncheckedUpdateWithoutSiteInputObjectSchema)])
}).strict();
export const CallUpdateWithWhereUniqueWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutSiteInput>;
export const CallUpdateWithWhereUniqueWithoutSiteInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './CallWhereUniqueInput.schema';
import { CallCreateWithoutSiteInputObjectSchema as CallCreateWithoutSiteInputObjectSchema } from './CallCreateWithoutSiteInput.schema';
import { CallUncheckedCreateWithoutSiteInputObjectSchema as CallUncheckedCreateWithoutSiteInputObjectSchema } from './CallUncheckedCreateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CallCreateWithoutSiteInputObjectSchema), z.lazy(() => CallUncheckedCreateWithoutSiteInputObjectSchema)])
}).strict();
export const CallCreateOrConnectWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallCreateOrConnectWithoutSiteInput>;
export const CallCreateOrConnectWithoutSiteInputObjectZodSchema = makeSchema();

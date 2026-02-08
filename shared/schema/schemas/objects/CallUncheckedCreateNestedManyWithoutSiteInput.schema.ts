import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallCreateWithoutSiteInputObjectSchema as CallCreateWithoutSiteInputObjectSchema } from './CallCreateWithoutSiteInput.schema';
import { CallUncheckedCreateWithoutSiteInputObjectSchema as CallUncheckedCreateWithoutSiteInputObjectSchema } from './CallUncheckedCreateWithoutSiteInput.schema';
import { CallCreateOrConnectWithoutSiteInputObjectSchema as CallCreateOrConnectWithoutSiteInputObjectSchema } from './CallCreateOrConnectWithoutSiteInput.schema';
import { CallCreateManySiteInputEnvelopeObjectSchema as CallCreateManySiteInputEnvelopeObjectSchema } from './CallCreateManySiteInputEnvelope.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './CallWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CallCreateWithoutSiteInputObjectSchema), z.lazy(() => CallCreateWithoutSiteInputObjectSchema).array(), z.lazy(() => CallUncheckedCreateWithoutSiteInputObjectSchema), z.lazy(() => CallUncheckedCreateWithoutSiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CallCreateOrConnectWithoutSiteInputObjectSchema), z.lazy(() => CallCreateOrConnectWithoutSiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CallCreateManySiteInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CallWhereUniqueInputObjectSchema), z.lazy(() => CallWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CallUncheckedCreateNestedManyWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutSiteInput>;
export const CallUncheckedCreateNestedManyWithoutSiteInputObjectZodSchema = makeSchema();

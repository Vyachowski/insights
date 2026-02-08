import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallScalarWhereInputObjectSchema as CallScalarWhereInputObjectSchema } from './CallScalarWhereInput.schema';
import { CallUpdateManyMutationInputObjectSchema as CallUpdateManyMutationInputObjectSchema } from './CallUpdateManyMutationInput.schema';
import { CallUncheckedUpdateManyWithoutSiteInputObjectSchema as CallUncheckedUpdateManyWithoutSiteInputObjectSchema } from './CallUncheckedUpdateManyWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CallUpdateManyMutationInputObjectSchema), z.lazy(() => CallUncheckedUpdateManyWithoutSiteInputObjectSchema)])
}).strict();
export const CallUpdateManyWithWhereWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallUpdateManyWithWhereWithoutSiteInput>;
export const CallUpdateManyWithWhereWithoutSiteInputObjectZodSchema = makeSchema();

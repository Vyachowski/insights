import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportScalarWhereInputObjectSchema as CallImportScalarWhereInputObjectSchema } from './CallImportScalarWhereInput.schema';
import { CallImportUpdateManyMutationInputObjectSchema as CallImportUpdateManyMutationInputObjectSchema } from './CallImportUpdateManyMutationInput.schema';
import { CallImportUncheckedUpdateManyWithoutSiteInputObjectSchema as CallImportUncheckedUpdateManyWithoutSiteInputObjectSchema } from './CallImportUncheckedUpdateManyWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallImportScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CallImportUpdateManyMutationInputObjectSchema), z.lazy(() => CallImportUncheckedUpdateManyWithoutSiteInputObjectSchema)])
}).strict();
export const CallImportUpdateManyWithWhereWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallImportUpdateManyWithWhereWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportUpdateManyWithWhereWithoutSiteInput>;
export const CallImportUpdateManyWithWhereWithoutSiteInputObjectZodSchema = makeSchema();

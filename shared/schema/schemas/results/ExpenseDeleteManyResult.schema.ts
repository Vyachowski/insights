import * as z from 'zod';
export const ExpenseDeleteManyResultSchema = z.object({
  count: z.number()
});
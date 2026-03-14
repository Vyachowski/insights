import { normalizeExpenses } from '../normalizers';
import { parseCSV } from '../parsers';
import { ExpenseImportSchema } from '../schemas';
import { seedExpenses } from '../seeders';
import { validateExpensesData } from '../validators';

export async function importExpenses(expensesPath: string) {
  const expensesData = parseCSV(expensesPath, ExpenseImportSchema);
  const normalizedExpenses = normalizeExpenses(expensesData);
  const validatedExpensesData = validateExpensesData(normalizedExpenses);

  await seedExpenses(validatedExpensesData);
}

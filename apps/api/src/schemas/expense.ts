import {
  createExpenseSchema,
  updateExpenseSchema,
  type CreateExpenseInput,
  type Expense,
} from '@oikwee/domains/expenses';
import { z } from 'zod';

export { createExpenseSchema, updateExpenseSchema };
export type { CreateExpenseInput, Expense };

export type ExpenseDocument = CreateExpenseInput & {
  _id: string;
  userId: string;
  installmentsPaid: number;
  totalAmountPaid: number;
  createdAt: string;
  updatedAt: string;
};

export const advanceInstallmentSchema = z.object({
  count: z.number().int().min(1),
  amount: z.number().positive(),
});

export const listExpensesQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

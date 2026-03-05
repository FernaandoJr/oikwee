import {
  createExpenseSchema,
  updateExpenseSchema,
  type CreateExpenseInput,
} from '@oikwee/domains/expenses';

export { createExpenseSchema, updateExpenseSchema };

export type { CreateExpenseInput };

export type ExpenseDocument = CreateExpenseInput & {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

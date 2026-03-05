import { z } from 'zod';

export const expenseBodySchema = z.object({
  isPaid: z.boolean().default(false),
  category: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
  amount: z.coerce.number().positive(),
  recurrence: z.number().int().default(1),
  recurrenceInterval: z.number().int().optional(),
  recurrenceGroupId: z.string().optional(),
  paymentMethod: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.number().int().optional().default(2),
});

export const createExpenseSchema = expenseBodySchema.refine(
  (data: { recurrence: number; recurrenceInterval?: number }) =>
    data.recurrence !== 2 || !!data.recurrenceInterval,
  {
    message: 'recurrenceInterval required when recurrence is recurring',
    path: ['recurrenceInterval'],
  },
);

export const updateExpenseSchema = expenseBodySchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export type ExpenseDocument = CreateExpenseInput & {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

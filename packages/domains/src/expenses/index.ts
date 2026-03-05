import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().min(1),
  description: z.string().optional(),
  isPaid: z.boolean().default(false),
  recurrence: z.union([z.literal(1), z.literal(2)]).default(1),
  recurrenceInterval: z
    .union([z.literal(1), z.literal(2), z.literal(3)])
    .optional(),
  recurrenceGroupId: z.string().optional(),
  paymentMethod: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createExpenseSchema = expenseSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .refine(
    (data) => data.recurrence !== 2 || data.recurrenceInterval !== undefined,
    {
      message: 'recurrenceInterval required when recurrence is recurring',
      path: ['recurrenceInterval'],
    },
  );

export const updateExpenseSchema = expenseSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

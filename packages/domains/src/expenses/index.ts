import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().min(1),
  description: z.string().optional(),
  isPaid: z.boolean().default(false),
  expenseType: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(3),
  recurrenceInterval: z
    .union([z.literal(1), z.literal(2), z.literal(3)])
    .optional(),
  recurrenceGroupId: z.string().optional(),
  installments: z.number().int().min(1).optional(),
  parentId: z.string().optional(),
  paymentMethod: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createExpenseSchema = expenseSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .refine(
    (data) => data.expenseType !== 2 || data.installments !== undefined,
    {
      message: 'Número de parcelas obrigatório',
      path: ['installments'],
    },
  );

export const updateExpenseSchema = expenseSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial()
  .refine(
    (data) => data.expenseType !== 2 || data.installments !== undefined,
    {
      message: 'Número de parcelas obrigatório',
      path: ['installments'],
    },
  );

export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

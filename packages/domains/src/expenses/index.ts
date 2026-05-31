import { z } from 'zod';

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Streaming',
  'Tecnologia',
  'Outros',
] as const;

export const PAYMENT_METHODS = [
  'Dinheiro',
  'PIX',
  'Cartão de crédito',
  'Cartão de débito',
  'Boleto',
] as const;

export const EXPENSE_TYPES = ['subscription', 'installment'] as const;
export const RECURRENCE_INTERVALS = ['weekly', 'monthly', 'annual'] as const;
export const EXPENSE_STATUSES = ['active', 'paused', 'cancelled', 'completed'] as const;

export type Category = (typeof CATEGORIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type ExpenseType = (typeof EXPENSE_TYPES)[number];
export type RecurrenceInterval = (typeof RECURRENCE_INTERVALS)[number];
export type ExpenseStatus = (typeof EXPENSE_STATUSES)[number];

export const expenseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  amount: z.number().positive(),
  category: z.enum(CATEGORIES),
  type: z.enum(EXPENSE_TYPES),

  recurrenceInterval: z.enum(RECURRENCE_INTERVALS).optional(),
  status: z.enum(EXPENSE_STATUSES).default('active'),
  startDate: z.string().min(1),

  installmentsTotal: z.number().int().min(1).optional(),
  installmentsPaid: z.number().int().min(0).default(0),
  totalAmountPaid: z.number().min(0).default(0),

  isPaid: z.boolean().default(false),
  lastPaidAt: z.string().optional(),
  lastResetAt: z.string().optional(),

  creditCardId: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  dueDay: z.number().int().min(1).max(31).optional(),
  notes: z.string().optional(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createExpenseSchema = expenseSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    installmentsPaid: true,
    totalAmountPaid: true,
    lastPaidAt: true,
    lastResetAt: true,
  })
  .superRefine((data, ctx) => {
    if (data.type === 'subscription' && !data.recurrenceInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Intervalo de recorrência obrigatório para assinaturas',
        path: ['recurrenceInterval'],
      });
    }
    if (data.type === 'installment' && !data.installmentsTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número de parcelas obrigatório',
        path: ['installmentsTotal'],
      });
    }
  });

export const updateExpenseSchema = expenseSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    installmentsPaid: true,
    totalAmountPaid: true,
    lastPaidAt: true,
    lastResetAt: true,
  })
  .partial()
  .superRefine((data, ctx) => {
    if (data.type === 'subscription' && data.recurrenceInterval === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Intervalo de recorrência obrigatório para assinaturas',
        path: ['recurrenceInterval'],
      });
    }
    if (data.type === 'installment' && !data.installmentsTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número de parcelas obrigatório',
        path: ['installmentsTotal'],
      });
    }
  });

export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

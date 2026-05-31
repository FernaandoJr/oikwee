import { z } from 'zod';
import { expenseSchema } from '@oikwee/domains/expenses';

export const expenseFormSchema = expenseSchema
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
    if (data.type === 'subscription' && !data.recurrenceInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validationRecurrenceRequired',
        path: ['recurrenceInterval'],
      });
    }
    if (data.type === 'installment' && !data.installmentsTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validationInstallmentsRequired',
        path: ['installmentsTotal'],
      });
    }
  });

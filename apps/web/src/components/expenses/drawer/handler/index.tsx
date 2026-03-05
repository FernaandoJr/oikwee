'use client';

import { expensesService } from '@/services/expenses';
import type { Expense } from '@/services/expenses/types';
import { useQueryClient } from '@tanstack/react-query';
import { expensesQueryKeys } from '../../constants/query-keys';
import type { ExpenseFormValues } from '../new-expense-form';
import { NewExpenseForm } from '../new-expense-form';

interface ExpenseFormHandlerProps {
  formId: string;
  isEdit: boolean;
  expense?: Expense | null;
  onSuccess?: () => void;
}

function expenseToDefaultValues(expense: Expense): Partial<ExpenseFormValues> {
  return {
    description: expense.description ?? '',
    category: expense.category,
    amount: expense.amount,
    date: expense.date,
    dueDate: expense.dueDate ?? '',
    isPaid: expense.isPaid,
    recurrence: expense.recurrence,
    recurrenceInterval: expense.recurrenceInterval,
    paymentMethod: expense.paymentMethod ?? '',
  };
}

export function ExpenseFormHandler({
  formId,
  isEdit,
  expense,
  onSuccess,
}: ExpenseFormHandlerProps) {
  const queryClient = useQueryClient();

  const defaultValues: Partial<ExpenseFormValues> =
    isEdit && expense ? expenseToDefaultValues(expense) : {};

  const handleSubmit = async (values: ExpenseFormValues) => {
    if (isEdit) {
      if (!expense?.id) return;
      await expensesService.patch(expense.id, values);
    } else {
      await expensesService.create(values);
    }

    await queryClient.invalidateQueries({
      queryKey: expensesQueryKeys.list(),
    });
    onSuccess?.();
  };

  return (
    <NewExpenseForm
      key={expense?.id ?? 'new'}
      formId={formId}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    />
  );
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { expensesQueryKeys } from '../lib/queryKeys';
import { zodV4Resolver } from '../lib/resolver';
import { expensesService } from '../services';
import {
  createExpenseSchema,
  updateExpenseSchema,
  type CreateExpenseInput,
  type Expense,
  type UpdateExpenseInput,
} from '../types';

const expenseFormSchema = createExpenseSchema.superRefine((data, ctx) => {
  if (!data.description || data.description.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Descrição é obrigatória',
      path: ['description'],
    });
  }
});

export type ExpenseFormValues = CreateExpenseInput;

const defaultFormValues: ExpenseFormValues = {
  description: '',
  category: '',
  amount: 0,
  date: '',
  dueDate: '',
  isPaid: false,
  expenseType: 3,
  recurrenceInterval: undefined,
  installments: undefined,
  parentId: undefined,
  paymentMethod: '',
  status: 2,
};

function expenseToFormValues(expense: Expense): ExpenseFormValues {
  return {
    description: expense.description ?? '',
    category: expense.category,
    amount: expense.amount,
    date: expense.date,
    dueDate: expense.dueDate ?? '',
    isPaid: expense.isPaid,
    expenseType: expense.expenseType ?? 3,
    recurrenceInterval: expense.recurrenceInterval,
    installments: expense.installments,
    parentId: expense.parentId,
    paymentMethod: expense.paymentMethod ?? '',
    status: expense.status ?? 2,
  };
}

interface UseExpenseHandlerProps {
  isEdit: boolean;
  expense?: Expense;
}

export function useExpenseHandler({ isEdit, expense }: UseExpenseHandlerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const schema = isEdit ? updateExpenseSchema : expenseFormSchema;

  const form = useForm<ExpenseFormValues>({
    resolver: zodV4Resolver(schema as z.ZodType<ExpenseFormValues>),
    defaultValues:
      isEdit && expense ? expenseToFormValues(expense) : defaultFormValues,
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateExpenseInput) => expensesService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryKeys.list() });
      router.back();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateExpenseInput }) =>
      expensesService.patch(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryKeys.list() });
      router.back();
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && expense?.id) {
      updateMutation.mutate({ id: expense.id, values });
    } else {
      createMutation.mutate(values);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}

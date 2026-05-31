import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PatchDiff, PayloadBuilder } from '@/lib/payload';
import { zodV4Resolver } from '../lib/resolver';
import { expensesService } from '../services';
import {
  createExpenseSchema,
  updateExpenseSchema,
  type IExpenseComplete,
} from '../types';

const expenseFormSchema = createExpenseSchema.superRefine((data, ctx) => {
  if (!data.name || data.name.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Nome é obrigatório',
      path: ['name'],
    });
  }
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

const defaultFormValues: Partial<ExpenseFormValues> = {
  name: '',
  amount: 0,
  category: undefined,
  type: 'subscription',
  recurrenceInterval: 'monthly',
  status: 'active',
  startDate: new Date().toISOString().split('T')[0],
  installmentsTotal: undefined,
  isPaid: false,
  dueDay: undefined,
  creditCardId: undefined,
  paymentMethod: undefined,
  notes: '',
};

function expenseToFormValues(
  expense: IExpenseComplete,
): Partial<ExpenseFormValues> {
  return {
    name: expense.name,
    amount: expense.amount,
    category: expense.category,
    type: expense.type,
    recurrenceInterval: expense.recurrenceInterval,
    status: expense.status,
    startDate: expense.startDate,
    installmentsTotal: expense.installmentsTotal,
    isPaid: expense.isPaid,
    dueDay: expense.dueDay,
    creditCardId: expense.creditCardId,
    paymentMethod: expense.paymentMethod,
    notes: expense.notes ?? '',
  };
}

interface UseExpenseHandlerProps {
  isEdit: boolean;
  expense?: IExpenseComplete;
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
    mutationFn: (values: Partial<IExpenseComplete>) => {
      const payload = PayloadBuilder().from(values);
      return expensesService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      router.back();
    },
    onError: () => {
      toast.error('Erro ao criar despesa');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<IExpenseComplete>;
    }) => {
      const payload = new PatchDiff().diff(values, expense!);
      return expensesService.patch(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      router.back();
    },
    onError: () => {
      toast.error('Erro ao salvar despesa');
    },
  });

  const onSubmit = form.handleSubmit(
    (values) => {
      if (isEdit && expense?.id) {
        updateMutation.mutate({ id: expense.id, values });
      } else {
        createMutation.mutate(values as Partial<IExpenseComplete>);
      }
    },
    () => {
      toast.error('Preencha todos os campos obrigatórios');
    },
  );

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { PatchDiff, PayloadBuilder } from '@/lib/payload';
import { expensesService } from '../services';
import { expenseFormSchema } from '../schema';
import { type IExpenseComplete } from '../types';

const defaultFormValues: Partial<IExpenseComplete> = {
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

interface UseExpenseHandlerProps {
  isEdit: boolean;
  expense?: IExpenseComplete;
}

export function useExpenseHandler({ isEdit, expense }: UseExpenseHandlerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<Partial<IExpenseComplete>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: isEdit && expense ? expense : defaultFormValues,
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
        createMutation.mutate(values);
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

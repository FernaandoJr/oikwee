import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { expensesQueryKeys } from '../lib/query-keys';
import { expensesService } from '../services';
import type { Expense } from '../types';

export function useExpenseList() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: expensesQueryKeys.list(),
    queryFn: (): Promise<Expense[]> => expensesService.get(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expensesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryKeys.list() });
      toast.success('Despesa excluída com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir despesa');
    },
  });

  return {
    data: data ?? [],
    isLoading,
    deleteExpense: (id: string) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { toast } from 'sonner';
import { expensesQueryKeys } from '../lib/query-keys';
import { expensesService } from '../services';
import type { Expense } from '../types';

export function useExpenseList() {
  const queryClient = useQueryClient();

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const { data: allData = [], isLoading } = useQuery({
    queryKey: expensesQueryKeys.list(),
    queryFn: (): Promise<Expense[]> => expensesService.get(),
  });

  const pageCount = Math.max(1, Math.ceil(allData.length / perPage));
  const start = (page - 1) * perPage;
  const data = allData.slice(start, start + perPage);

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
    data,
    pageCount,
    isLoading,
    deleteExpense: (id: string) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
  };
}

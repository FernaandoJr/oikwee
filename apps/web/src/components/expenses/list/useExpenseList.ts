import type { PaginatedResponse } from '@oikwee/domains/pagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseAsInteger } from 'nuqs';
import { useLocalState } from '@/hooks/useLocalState';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSessionState } from '@/hooks/useSessionState';
import { expensesQueryKeys, expensesService } from '../services';
import type { IExpenseComplete } from '../types';

export function useExpenseList() {
  const queryClient = useQueryClient();

  const [cursor, setCursor] = useSessionState('expenses_cursor', '');
  const [limitStr, setLimitStr] = useLocalState('expenses_limit', '20');
  const limit = parseAsInteger.parseServerSide(limitStr) ?? 20;
  const setLimit = (n: number) => setLimitStr(String(n));
  const [advancingExpense, setAdvancingExpense] = useState<IExpenseComplete | null>(null);

  const queryKey = expensesQueryKeys.list(cursor || undefined, limit);

  const { data: response, isLoading } = useQuery({
    queryKey,
    queryFn: (): Promise<PaginatedResponse<IExpenseComplete>> =>
      expensesService.list({ cursor: cursor || undefined, limit }),
  });

  const data = response?.data ?? [];
  const meta = response?.meta;

  const onNext = () => {
    if (meta?.nextCursor) setCursor(meta.nextCursor);
  };

  const onPrev = () => {
    if (meta?.prevCursor) setCursor(meta.prevCursor);
  };

  const onLimitChange = (n: number) => {
    setLimit(n);
    setCursor('');
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expensesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Despesa excluída com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir despesa');
    },
  });

  const togglePaidMutation = useMutation({
    mutationFn: ({ id, isPaid }: { id: string; isPaid: boolean }) =>
      expensesService.setPaid(id, isPaid),
    onMutate: async ({ id, isPaid }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PaginatedResponse<IExpenseComplete>>(queryKey);
      queryClient.setQueryData<PaginatedResponse<IExpenseComplete>>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, data: old.data.map((e) => (e.id === id ? { ...e, isPaid } : e)) };
      });
      return { previous };
    },
    onSuccess: (updated, { id }) => {
      queryClient.setQueryData<PaginatedResponse<IExpenseComplete>>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, data: old.data.map((e) => (e.id === id ? updated : e)) };
      });
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
  });

  const advanceMutation = useMutation({
    mutationFn: ({ id, count, amount }: { id: string; count: number; amount: number }) =>
      expensesService.advance(id, { count, amount }),
    onSuccess: (_, { count, amount }) => {
      queryClient.invalidateQueries({ queryKey });
      setAdvancingExpense(null);
      const originalAmount = advancingExpense ? count * advancingExpense.amount : 0;
      const discount = originalAmount - amount;
      if (discount > 0) {
        const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discount);
        toast.success(`Parcelas adiantadas com desconto de ${formatted}`);
      } else {
        toast.success('Parcelas adiantadas com sucesso');
      }
    },
    onError: () => {
      toast.error('Erro ao adiantar parcelas');
    },
  });

  return {
    data,
    isLoading,
    hasMore: meta?.hasMore ?? false,
    hasPrev: !!meta?.prevCursor,
    onNext,
    onPrev,
    count: meta?.count ?? 0,
    limit,
    onLimitChange,
    deleteExpense: (id: string) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
    togglePaid: (id: string, isPaid: boolean) => togglePaidMutation.mutate({ id, isPaid }),
    isTogglingPaid: togglePaidMutation.isPending,
    advancingExpense,
    setAdvancingExpense,
    advanceInstallment: (id: string, count: number, amount: number) =>
      advanceMutation.mutate({ id, count, amount }),
    isAdvancing: advanceMutation.isPending,
  };
}

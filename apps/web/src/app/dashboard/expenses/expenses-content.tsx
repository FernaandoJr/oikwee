'use client';

import { expensesQueryKeys } from '@/components/expenses/constants/query-keys';
import { HandlerList } from '@/components/expenses/list';
import { expensesService } from '@/services/expenses';
import { useQuery } from '@tanstack/react-query';

export function ExpensesPageContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: expensesQueryKeys.list(),
    queryFn: () => expensesService.get(),
  });

  if (isLoading)
    return <div className="text-muted-foreground py-8">Carregando...</div>;
  if (error)
    return (
      <div className="text-destructive py-8">Erro ao carregar despesas.</div>
    );

  return <HandlerList data={data ?? []} />;
}

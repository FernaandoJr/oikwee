'use client';

import { ExpenseHandler } from '@/components/expenses/handler';
import { expensesQueryKeys } from '@/components/expenses/lib/queryKeys';
import { expensesService } from '@/components/expenses/services';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';

export default function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: expense, isLoading } = useQuery({
    queryKey: expensesQueryKeys.item(id),
    queryFn: () => expensesService.getOne(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="container mx-auto p-4 text-destructive">
        Despesa não encontrada.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ExpenseHandler isEdit defaultValues={expense} />
    </div>
  );
}

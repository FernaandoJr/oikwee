'use client';

import { ExpenseHandler } from '@/components/expenses/handler';
import { expensesQueryKeys } from '@/components/expenses/lib/queryKeys';
import { expensesService } from '@/components/expenses/services';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';

export default function EditExpenseModal({
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
    return null;
  }

  if (!expense) {
    return null;
  }

  return <ExpenseHandler isEdit defaultValues={expense} />;
}

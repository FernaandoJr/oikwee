'use client';

import { ExpenseTable } from './expense-table';
import { useExpenseList } from './use-expense-list';

export function ExpenseList() {
  const { data, isLoading, deleteExpense, isDeleting } = useExpenseList();

  if (isLoading) {
    return (
      <div className="text-muted-foreground py-8">Carregando...</div>
    );
  }

  return (
    <ExpenseTable data={data} onDelete={deleteExpense} isDeleting={isDeleting} />
  );
}
